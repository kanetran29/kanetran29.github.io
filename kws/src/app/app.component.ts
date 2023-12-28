import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '@shared/components';

@Component({
  standalone: true,
  imports: [RouterModule, HeaderComponent],
  selector: 'kws-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent {
  title = 'kws';
}
