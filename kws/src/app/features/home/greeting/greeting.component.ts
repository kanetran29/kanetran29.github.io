import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'kws-greeting',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './greeting.component.html',
  styleUrl: './greeting.component.sass',
})
export class GreetingComponent {}
