import { Component, Input } from '@angular/core';

@Component({
  selector: 'kws-title-and-sub',
  standalone: true,
  imports: [],
  template: `
      <section class="title-and-sub display-flex flex-center flex-column">
        <h2 class="title typo-heading-2">{{ title }}</h2>
        <h6 class="subtitle typo-heading-6"> {{ subtitle }}</h6>
      </section>
  `,
  styles: `
    .title
        color: var(--color--primary--700)
    .subtitle
        margin-top: -32px
  `,
})
export class TitleAndSubComponent {
  @Input() title!: string;
  @Input() subtitle!: string;
}
