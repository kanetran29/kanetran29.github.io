import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { ScrollViewComponent } from '@shared/components';
import { PureWrapperPipe } from '@core/pipes/pure-wrapper.pipe';

@Component({
  selector: 'kws-layout',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    ScrollViewComponent,
    RouterOutlet,
    PureWrapperPipe
  ],
  template: `
    <kws-header [class.scrolled]="isScrolled | pure: scrollPosition[0]"></kws-header>
      <kws-scroll-view (scrollPositionChange)="scrollPosition = $event">
          <router-outlet></router-outlet>
      </kws-scroll-view>
    <kws-footer></kws-footer>
  `,
  styleUrl: './layout.component.sass'
})
export class LayoutComponent {
  scrollPosition: [number, number] = [0, 0];
  isScrolled(scrollTop: number): boolean {
    return !!scrollTop;
  }
}
