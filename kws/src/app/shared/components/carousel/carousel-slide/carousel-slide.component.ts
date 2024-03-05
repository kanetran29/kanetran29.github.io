import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeStyle } from '@angular/platform-browser';
import { ListKeyManagerOption } from '@angular/cdk/a11y';

@Component({
  selector: 'kws-carousel-slide',
  standalone: true,
  imports: [CommonModule],
  template: `
  <ng-template>
    <div class="kws-carousel-slide" [style.background-image]="'url(' + image + ')'">
      <div class="kws-carousel-slide__container display-flex flex-column">
        <ng-content></ng-content>
      </div>
    </div>
  </ng-template>
  `,
  styleUrl: './carousel-slide.component.sass',
})
export class CarouselSlideComponent implements ListKeyManagerOption{
  @Input() image!: SafeStyle;
  @Input() disabled = false;
  @ViewChild(TemplateRef) public templateRef!: TemplateRef<HTMLDivElement>;
}
