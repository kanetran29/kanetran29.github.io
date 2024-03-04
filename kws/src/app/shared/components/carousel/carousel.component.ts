import { animate, style, AnimationBuilder } from '@angular/animations';
import { ListKeyManager } from '@angular/cdk/a11y';
import { NgFor, NgIf, NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  PLATFORM_ID,
  QueryList,
  Renderer2,
  ViewChild,
  effect,
  signal
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { interval, BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { CarouselSlideComponent } from './carousel-slide/carousel-slide.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

enum Direction {
  Left,
  Right,
  Index
}

export type Orientation = 'ltr' | 'rtl';

@Component({
  selector: 'kws-carousel',
  standalone: true,
  imports: [NgTemplateOutlet, MatIconModule, MatButtonModule, NgIf, NgFor],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.sass',
})
export class CarouselComponent
  implements AfterContentInit, AfterViewInit, OnDestroy {

  @Input() timings = '250ms ease-in';
  @Input() interval = 1000;
  @Input() hideArrows = false;
  @Input() hideIndicators = false;
  @Input() color: ThemePalette = 'accent';
  @Input() maintainAspectRatio = true;
  @Input() useKeyboard = true;
  @Input() useMouseWheel = true;
  @Input() orientation: Orientation = 'ltr';

  @ContentChildren(CarouselSlideComponent) slidesList: QueryList<CarouselSlideComponent>;
  @ViewChild('carouselContainer') carouselContainer: ElementRef<HTMLDivElement>;
  @ViewChild('carouselList') carouselList: ElementRef<HTMLElement>;
  
  listKeyManager: ListKeyManager<CarouselSlideComponent>;
  interval$ = new BehaviorSubject<number>(5000);
  slides$ = new BehaviorSubject<number>(0);
  orientation$ = new Subject<Orientation>();
  timer$: Observable<number>;
  timerStop$ = new Subject<void>();
  destroy$ = new Subject<void>();
  playing = false;

  constructor(
    private animationBuilder: AnimationBuilder,
    private renderer: Renderer2
  ) { }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    if (this.useKeyboard && !this.playing) {
      this.listKeyManager.onKeydown(event);
    }
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
    if (this.useMouseWheel) {
      event.preventDefault(); // prevent window to scroll
      const delta = Math.sign(event.deltaY);

      if (delta > 0) {
        this.next();
      } else if (delta < 0) {
        this.previous();
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.slideTo(0);
  }

  get currentIndex(): number {
    return this.listKeyManager?.activeItemIndex ?? 0;
  }

  ngAfterContentInit(): void {
    this.listKeyManager = new ListKeyManager(this.slidesList)
      .withVerticalOrientation(false)
      .withHorizontalOrientation(this.orientation)
      .withWrap(true);

    this.listKeyManager.updateActiveItem(0);
    this.listKeyManager.change
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.playAnimation());
  }

  ngAfterViewInit(): void {
    this.interval$.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.stopTimer();
      this.resetTimer(value);
      this.startTimer();
    });

    this.orientation$
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => this.listKeyManager.withHorizontalOrientation(value));

    this.slides$
      .pipe(
        takeUntil(this.destroy$),
        filter(value => value !== 0 && value < this.slidesList.length)
      )
      .subscribe(value => this.resetSlides(value));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    if (Math.abs(event.velocityY) > Math.abs(event.velocityX)) {
      return;
    }
    let deltaX = event.deltaX;
    if (this.isOutOfBounds()) {
      deltaX *= 0.2;
    }

    this.renderer.setStyle(slideElem, 'cursor', 'grabbing');
    this.renderer.setStyle(
      this.carouselList.nativeElement,
      'transform',
      this.getTranslation(this.getOffset() + deltaX)
    );
  }

  onPanEnd(event: any, slideElem: HTMLElement): void {
    this.renderer.removeStyle(slideElem, 'cursor');

    if (Math.abs(event.deltaX) > this.getWidth() * 0.25) {
      if (event.deltaX <= 0) {
        this.next();
        return;
      }
      this.previous();
      return;
    }
    this.playAnimation();
  }

  isOutOfBounds(): boolean {
    const sign = this.orientation === 'rtl' ? -1 : 1;
    const left =
      sign *
      (this.carouselList.nativeElement.getBoundingClientRect().left -
        this.carouselList.nativeElement.offsetParent!.getBoundingClientRect().left);
    const lastIndex = this.slidesList.length - 1;
    const width = -this.getWidth() * lastIndex;

    return (
      (this.listKeyManager.activeItemIndex === 0 && left >= 0) ||
      (this.listKeyManager.activeItemIndex === lastIndex && left <= width)
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

  getOffset(): number {
    const offset = this.listKeyManager.activeItemIndex! * this.getWidth();
    const sign = this.orientation === 'rtl' ? 1 : -1;
    return sign * offset;
  }

  getTranslation(offset: number): string {
    return `translateX(${offset}px)`;
  }

  getWidth(): number {
    return this.carouselContainer.nativeElement.clientWidth;
  }

  goto(direction: Direction, index?: number) {
    if (!this.playing) {
      const rtl = this.orientation === 'rtl';

      switch (direction) {
        case Direction.Left:
          rtl
            ? this.listKeyManager.setNextItemActive()
            : this.listKeyManager.setPreviousItemActive();
          break;
        case Direction.Right:
          rtl
            ? this.listKeyManager.setPreviousItemActive()
            : this.listKeyManager.setNextItemActive();
            break;
        case Direction.Index:
          this.listKeyManager.setActiveItem(index!);
          break;
      }
    }
  }

  playAnimation(): void {
    const translation = this.getTranslation(this.getOffset());
    const factory = this.animationBuilder.build(
      animate(this.timings, style({ transform: translation }))
    );
    const animation = factory.create(this.carouselList.nativeElement);

    animation.onStart(() => {
      this.playing = true;
    });
    animation.onDone(() => {
      this.playing = false;
      this.renderer.setStyle(
        this.carouselList.nativeElement,
        'transform',
        translation
      );
      animation.destroy();
    });
    animation.play();
  }

  resetSlides(slides: number): void {
    this.slidesList.reset(this.slidesList.toArray().slice(0, slides));
  }

  resetTimer(value: number): void {
    this.timer$ = interval(value);
  }

  startTimer(): void {
    this.timer$
      .pipe(
        takeUntil(this.timerStop$),
        takeUntil(this.destroy$),
        filter(() => this.isVisible())
      )
      .subscribe(() => {
        this.listKeyManager.withWrap(true).setNextItemActive();
      });
  }

  stopTimer(): void {
    this.timerStop$.next();
  }
}

