import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

interface HeaderPage {
  name: string;
  link: string;
}

interface HeaderSocial {
  link: string;
  icon: string;
}

enum HeaderPageEnum {
  Home = 'home',
  TechStack = 'tech-stack',
  Projects = 'projects',
  About = 'about',
  Contact = 'contact'
}

const PAGES_MAP: Record<HeaderPageEnum, HeaderPage> = {
  [HeaderPageEnum.Home]: {
    name: 'Home',
    link: '/home'
  },
  [HeaderPageEnum.TechStack]: {
    name: 'Tech Stack',
    link: '/tech-stack'
  },
  [HeaderPageEnum.Projects]: {
    name: 'Projects',
    link: '/projects'
  },
  [HeaderPageEnum.About]: {
    name: 'About',
    link: '/about'
  },
  [HeaderPageEnum.Contact]: {
    name: 'Contact',
    link: '/contact'
  }
}

const SOCIALS_MAP: Record<string, HeaderSocial> = {
  github: {
    link: 'https://github.com/kanetran29',
    icon: 'socials:github'
  },
  linkedin: {
    link: 'https://www.linkedin.com/in/kane-tran-a62809247/',
    icon: 'socials:linkedin'
  },
}
@Component({
  selector: 'kws-header',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass',
})
export class HeaderComponent {
  readonly PAGES = Object.values(PAGES_MAP);
  readonly SOCIALS = Object.values(SOCIALS_MAP);

  router = inject(Router);

  $currentPage = toSignal<HeaderPage>(this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(event => this.getPageFromPath((event as NavigationEnd).url.replace('/', ''))))
  );

  /**
   * Returns a page based on the provided path or defaults to the Home page.
   * @param {string} path - The path to a specific page
   * @returns {HeaderPage} Current page or the Home page by default.
   */
  getPageFromPath(path: string) {
    return PAGES_MAP[path as HeaderPageEnum] ?? PAGES_MAP[HeaderPageEnum.Home]
  }

  openInNewTab(link: string) {
    window.open(link, '_blank');
  }
}
