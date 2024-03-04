import { animate, style, AnimationBuilder } from '@angular/animations';
import { ListKeyManager } from '@angular/cdk/a11y';
import { NgFor, NgIf, NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  DestroyRef,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChild,
  effect,
  inject,
  signal
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { interval, BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { CarouselSlideComponent } from './carousel-slide/carousel-slide.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

enum Direction {
  Left,
  Right,
  Index
}

@UntilDestroy()
@Component({
  selector: 'kws-carousel',
  standalone: true,
  imports: [NgTemplateOutlet, MatIconModule, MatButtonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.sass',
})
export class CarouselComponent implements AfterContentInit, AfterViewInit {

  @Input() timings = '300ms ease-in';
  @Input() hideArrows = false;
  @Input() hideIndicators = false;
  @Input() set interval(value: number) {
    this.stopTimer();
    this.resetTimer(value);
    this.startTimer();
  };

  @ContentChildren(CarouselSlideComponent) slidesList: QueryList<CarouselSlideComponent>;
  @ViewChild('carouselContainer') carouselContainer: ElementRef<HTMLDivElement>;
  @ViewChild('carouselList') carouselList: ElementRef<HTMLElement>;
  
  private _listKeyManager: ListKeyManager<CarouselSlideComponent>;
  
  private _timer$: Observable<number>;
  private _timerStop$ = new Subject<void>();
  private _playing = false;

  private _animationBuilder: AnimationBuilder = inject(AnimationBuilder);
  private _renderer: Renderer2 = inject(Renderer2);

  _ = inject(DestroyRef).onDestroy(() => this._timerStop$.complete());

  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    if (this._playing)
      return;
    this._listKeyManager.onKeydown(event);
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.stopTimer();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.startTimer();
  }

  @HostListener('mousewheel', ['$event'])
  onMouseWheel(event: WheelEvent): void {
    event.preventDefault(); // prevent window to scroll
    event.deltaY > 0 ? this.next() : this.previous();
  }

  @HostListener('window:resize', ['$event'])
  onResize(_: Event): void {
    this.slideTo(0);
  }

  get currentIndex(): number {
    return this._listKeyManager?.activeItemIndex ?? 0;
  }

  get offset(): number {
    return -this._listKeyManager.activeItemIndex! * this.width;
  }
  
  get width(): number {
    return this.carouselContainer.nativeElement.clientWidth;
  }

  ngAfterContentInit(): void {
    this._listKeyManager = new ListKeyManager(this.slidesList)
      .withVerticalOrientation(false)
      .withHorizontalOrientation('ltr')
      .withWrap(true);

    this._listKeyManager.updateActiveItem(0);
    this._listKeyManager.change.pipe(untilDestroyed(this)).subscribe(() => this.playAnimation());
  }

  ngAfterViewInit(): void {
    this._listKeyManager.withHorizontalOrientation('ltr');
  }

  next(): void {
    this.goto(Direction.Right);
  }

  previous(): void {
    this.goto(Direction.Left);
  }

  slideTo(index: number): void {
    this.goto(Direction.Index, index);
  }

  onPan(event: any, slideElem: HTMLElement): void {
    if (Math.abs(event.velocityY) > Math.abs(event.velocityX))
      return;
    
    let deltaX = event.deltaX;

    if (this.isOutOfBounds()) {
      deltaX *= 0.2;
    }

    this._renderer.setStyle(slideElem, 'cursor', 'grabbing');
    this._renderer.setStyle(this.carouselList.nativeElement,'transform',this.getTranslation(this.offset + deltaX));
  }

  onPanEnd(event: any, slideElem: HTMLElement): void {
    this._renderer.removeStyle(slideElem, 'cursor');

    if (Math.abs(event.deltaX) > this.width * 0.25) {
      event.deltaX ? this.next() : this.previous();
    }
    this.playAnimation();
  }

  isOutOfBounds(): boolean {
    const left = 
        this.carouselList.nativeElement.getBoundingClientRect().left -
        this.carouselList.nativeElement.offsetParent!.getBoundingClientRect().left;
    const lastIndex = this.slidesList.length - 1;
    const width = -this.width * lastIndex;

    return (
      (!this._listKeyManager.activeItemIndex && left >= 0) ||
      (this._listKeyManager.activeItemIndex === lastIndex && left <= width)
    );
  }

  isVisible(): boolean {
    const elem = this.carouselContainer.nativeElement;
    const docViewTop = window.scrollY;
    const docViewBottom = docViewTop + window.innerHeight;
    const elemOffset = elem.getBoundingClientRect();
    const elemTop = docViewTop + elemOffset.top;
    const elemBottom = elemTop + elemOffset.height;
    return elemBottom <= docViewBottom || elemTop >= docViewTop;
  }

  getTranslation(offset: number): string {
    return `translateX(${offset}px)`;
  }


  goto(direction: Direction, index?: number): void {
    if (this._playing)
      return;
    switch (direction) {
      case Direction.Left:
        return this._listKeyManager.setPreviousItemActive();
      case Direction.Right:
        return this._listKeyManager.setNextItemActive();
      case Direction.Index:
        return this._listKeyManager.setActiveItem(index!);
    }
  }

  playAnimation(): void {
    const translation = this.getTranslation(this.offset);
    const factory = this._animationBuilder.build(animate(this.timings, style({ transform: translation })));
    const animation = factory.create(this.carouselList.nativeElement);

    animation.onStart(() => this._playing = true);
    animation.onDone(() => {
      this._playing = false;
      this._renderer.setStyle(this.carouselList.nativeElement, 'transform', translation);
      animation.destroy();
    });
    animation.play();
  }

  resetTimer(value: number): void {
    this._timer$ = interval(value);
  }

  startTimer(): void {
    this._timer$
      .pipe(
        takeUntil(this._timerStop$),
        untilDestroyed(this),
        filter(() => this.isVisible())
      )
      .subscribe(() => this._listKeyManager.withWrap(true).setNextItemActive());
  }

  stopTimer(): void {
    this._timerStop$.next();
  }
}

