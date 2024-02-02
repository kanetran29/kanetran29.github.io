import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { ScrollViewComponent } from '@shared/components';

@Component({
  selector: 'kws-layout',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    ScrollViewComponent,
    RouterOutlet
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.sass'
})
export class LayoutComponent {

}
