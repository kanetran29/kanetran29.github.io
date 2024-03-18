import { Component, EventEmitter, Output } from '@angular/core';
import { PureWrapperPipe } from '@core/pipes/pure-wrapper.pipe';

@Component({
  selector: 'kws-scroll-view',
  template: `
    <div class="scroll-view">
      <div class="scroll-view__container" #scrollContainer (scroll)="scrollPositionChange.emit([scrollContainer.scrollTop, scrollContainer.scrollLeft])">
          <div class="scroll-view__container__content">
              <ng-content></ng-content>
          </div>
      </div>
      <div class="scroll-view__bar-overlay vertical untouchable"></div>
    </div>
  `,
  styleUrl: './scroll-view.component.sass',
  standalone: true,
  imports: [PureWrapperPipe]
})
export class ScrollViewComponent {
  @Output() scrollPositionChange = new EventEmitter<[number, number]>();
}
