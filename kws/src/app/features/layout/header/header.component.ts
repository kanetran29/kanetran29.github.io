import { Component, DestroyRef, inject } from '@angular/core';
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, map, switchMap } from 'rxjs';

interface HeaderPage {
  name: string;
  link: string;
}
@UntilDestroy()
@Component({
  selector: 'kws-header',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.sass',
})
export class HeaderComponent {
  readonly pages: HeaderPage[] = [
    {
      name: 'Home',
      link: '/home'
    },
    {
      name: 'Tech Stack',
      link: '/tech-stack'
    },
    {
      name: 'Projects',
      link: '/projects'
    },
    {
      name: 'About',
      link: '/about'
    },
    {
      name: 'Contact',
      link: '/contact'
    }
  ]

  currentPage$: Observable<HeaderPage> = inject(ActivatedRoute)
                                            .url
                                            .pipe(
                                              untilDestroyed(this),
                                              map(url => this.pages.find(page => page.link === url[0].path) ?? this.pages[0])
                                            );
  router = inject(Router);
}
