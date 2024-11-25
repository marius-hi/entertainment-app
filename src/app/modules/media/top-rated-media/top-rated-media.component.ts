import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-top-rated',
  imports: [
    RouterOutlet
  ],
  templateUrl: './top-rated-media.component.html',
  standalone: true,
  styleUrl: './top-rated-media.component.scss'
})
export class TopRatedMediaComponent {

}
