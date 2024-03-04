import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from '@shared/components/carousel/carousel.component';
import { CarouselSlideComponent } from '@shared/components/carousel/carousel-slide/carousel-slide.component';

const BLOGS_MAP = [
  {
    title: 'Avoiding Re-computing With Pure Pipes',
    date: 'January 1, 2021',
    image: 'https://picsum.photos/id/12/1200/400',
  },
  {
    title: 'New Algorithm For Timeseries Optimization',
    date: 'January 1, 2021',
    image: 'https://picsum.photos/id/19/1200/400',
  },
  {
    title: 'My Portfolio\'s System Design',
    date: 'January 1, 2021',
    image: 'https://picsum.photos/id/99/1200/400',
  },
  {
    title: 'Study About Music Recognition',
    date: 'January 1, 2021',
    image: 'https://picsum.photos/id/120/1200/400',
  },
  {
    title: 'Tooltip Without Native Scripting',
    date: 'January 1, 2021',
    image: 'https://picsum.photos/id/87/1200/400',
  }
]

@Component({
  selector: 'kws-introduction',
  standalone: true,
  imports: [CarouselComponent, CarouselSlideComponent],
  templateUrl: './introduction.component.html',
  styleUrl: './introduction.component.sass',
})
export class IntroductionComponent {
  readonly BLOGS = BLOGS_MAP;
}
