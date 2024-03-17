import { Component } from '@angular/core';
import { PureWrapperPipe } from '@core/pipes/pure-wrapper.pipe';
import { TitleAndSubComponent } from '@shared/components/title-and-sub/title-and-sub.component';

@Component({
  selector: 'kws-tech-stack',
  standalone: true,
  imports: [PureWrapperPipe, TitleAndSubComponent],
  templateUrl: './tech-stack.component.html',
  styleUrl: './tech-stack.component.sass',
})
export class TechStackComponent {
  readonly TECH_STACK = [
    'Angular',
    'HTML',
    'CSS',
    'SASS',
    'TypeScript',
    'Material Design',
    'NET Core',
    'EF Core',
    'MongoDB',
    'Firebase',
  ]

  nameToIconPath(name: string): string {
    return `assets/icons/techs/${name.replace(' ','-').toLowerCase()}.png`;
  }
}
