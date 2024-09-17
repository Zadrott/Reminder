import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    AsyncPipe,
  ],
})
export class HomeComponent {
  // TODO : Fetch tasks from API
  tasks = [
    {
      title: 'Card 1',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eu hendrerit dolor',
    },
    {
      title: 'Card 2',
      content: 'Duis arcu ante, consectetur eu gravida quis, placerat et arcu',
    },
    {
      title: 'Card 3',
      content:
        'Nullam in sagittis est. Vivamus lacinia sem nibh, at maximus neque scelerisque mollis. Sed nec elit ipsum. Suspendisse tincidunt turpis lectus. Suspendisse eleifend porttitor tortor, tristique rutrum augue cursus ut. Sed semper eleifend faucibus.',
    },
    {
      title: 'Card 4',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eu hendrerit dolor',
    },
  ];
}
