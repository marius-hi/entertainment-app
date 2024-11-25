import { Component, Input, SimpleChanges } from '@angular/core';
import { IMovieItem, ITVShowItem } from '../media-data.service';
import { MediaItemComponent } from '../media-item/media-item.component';
import { MediaType } from '../../../app.routes';

@Component({
  selector: 'media-list',
  imports: [
    MediaItemComponent
  ],
  standalone: true,
  templateUrl: './media-list.component.html',
  styleUrl: './media-list.component.scss'
})
export class MediaListComponent {
  @Input() public items!:IMovieItem[]|ITVShowItem[];
  @Input() mediaType!:MediaType;

  public ngOnChanges(changes: SimpleChanges): void {
    console.log('L201 - ngOnChanges', changes, this.mediaType);
    if (changes['initialStars']) {
      // this.initialStars = changes['initialStars'].currentValue;
      // this.starsComponent?.setRating(this.initialStars);
    }
  }
}
