import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { RegistryIcon, registerIcons } from '@core/utils/icon-register/icon-register';
import { LayoutComponent } from '@features/layout/layout.component';

const SOCIAL_ICONS: RegistryIcon[] = [
  { name: 'github', src: 'assets/icons/socials/github.svg' },
  { name: 'linkedin', src: 'assets/icons/socials/linkedin.svg' }
]

@Component({
  standalone: true,
  imports: [RouterModule, LayoutComponent],
  selector: 'kws-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    registerIcons(this.matIconRegistry, this.domSanitizer, 'socials', SOCIAL_ICONS);
  }
}
