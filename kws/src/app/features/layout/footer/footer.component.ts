import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'kws-footer',
  standalone: true,
  imports: [],
  template:`
    <footer class="kws-footer display-flex flex-center">
      <section class="typo-body-3">Built by <span class="gradient">Kane Tran</span> with <span>💚 & 🥤</span></section>
    </footer>
  `,
  styleUrl: './footer.component.sass',
})
export class FooterComponent { }
