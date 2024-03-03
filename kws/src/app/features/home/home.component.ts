import { Component } from '@angular/core';
import { IntroductionComponent } from './introduction/introduction.component';
import { NgComponentOutlet } from '@angular/common';
import { GreetingComponent } from './greeting/greeting.component';
import { TechStackComponent } from './tech-stack/tech-stack.component';
import { ProjectsComponent } from './projects/projects.component';
 
@Component({
  selector: 'kws-home',
  standalone: true,
  imports: [NgComponentOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass',
})
export class HomeComponent {
  readonly SECTIONS = [
    GreetingComponent,
    IntroductionComponent,
    TechStackComponent,
    ProjectsComponent
  ]
}
