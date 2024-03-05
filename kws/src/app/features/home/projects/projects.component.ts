import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LetterIconComponent } from '@shared/components/letter-icon/letter-icon.component';
import { AnimatedCardComponent } from '@shared/components/animated-card/animated-card.component';
import { TitleAndSubComponent } from '@shared/components/title-and-sub/title-and-sub.component';

const PROJECTS_MAP = {
  ['Portal']: {
    name: 'Portal',
    description: 'Admin portal for managing platform',
    techStack: 'Angular 13+, .NET 5',
    role: 'Fullstack Developer',
  },
  ['Asset Explorer']: {
    name: 'Asset Explorer',
    description: 'Assets management and visualization',
    techStack: 'Angular 14+, .NET 5',
    role: 'Frontend Developer',
  },
  ['Landing Page']: {
    name: 'Landing Page',
    description: 'Landing page for marketing purposes',
    techStack: 'Angular 14+',
    role: 'Frontend Developer',
  },
  ['Online Report']: {
    name: 'Online Report',
    description: 'Report generation and visualization',
    techStack: 'Angular 14+',
    role: 'Frontend Developer',
  },
  ['RO Shared']: {
    name: 'RO Shared',
    description: 'Common UI components for all projects',
    techStack: 'Angular 14+',
    role: 'Frontend Developer',
  },
  ['Woundynamics']: {
    name: 'Woundynamics',
    description: 'Scheduling appointments and managing bills',
    techStack: 'Angular 14+, .NET 5',
    role: 'Fullstack Developer',
  },
  ['BKW WebUI']: {
    name: 'BKW WebUI',
    description: 'Power consumption and visualization',
    techStack: 'Angular 17+',
    role: 'Frontend Developer',
  },
  ['Generis']: {
    name: 'Generis',
    description: 'Common components and boilerplate',
    techStack: 'Angular 17+',
    role: 'Frontend Developer',
  },
}

@Component({
  selector: 'kws-projects',
  standalone: true,
  imports: [ AnimatedCardComponent, TitleAndSubComponent ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.sass',
})
export class ProjectsComponent {
  readonly PROJECTS = Object.values(PROJECTS_MAP);
}
