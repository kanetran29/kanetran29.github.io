import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'kws-letter-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="kws-letter-icon" [ngStyle]="{ 'width': size, 'height': size, 'font-size': size, 'line-height': size }">
        {{ letter.charAt(0) }}
    </div>`,
  styleUrl: './letter-icon.component.sass',
})
export class LetterIconComponent {
  @Input() letter: string;
  @Input() size: string = '200px';
}
