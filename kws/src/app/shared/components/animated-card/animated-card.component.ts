import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LetterIconComponent } from '../letter-icon/letter-icon.component';

@Component({
  selector: 'kws-animated-card',
  standalone: true,
  imports: [LetterIconComponent],
  templateUrl: './animated-card.component.html',
  styleUrl: './animated-card.component.sass',
})
export class AnimatedCardComponent implements AfterViewInit {
  @Input() title: string;
  @Input() description: string;
  @Input() techStack: string;
  @Input() role: string;
  @Input() link: string;

  @ViewChild('refDescription') refDescription: ElementRef;
  @ViewChild('top') top: ElementRef;

  constructor() { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.changeTitleHeight();
  }

  ngAfterViewInit(): void {
    this.changeTitleHeight();
  }

  changeTitleHeight() {
    this.top.nativeElement.style.setProperty('--description-height', `${this.refDescription.nativeElement.offsetHeight}px`);
    this.top.nativeElement.style.setProperty('--top-height', `${this.top.nativeElement.offsetHeight}px`);
  }
}
