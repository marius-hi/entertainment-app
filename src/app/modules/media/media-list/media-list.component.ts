import { Component, Input, SimpleChanges } from '@angular/core';
import { MediaType } from '../../../app.settings';
import { MediaItemComponent } from '../media-item/media-item.component';
import { IMediaItem } from '../media.service';

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
  @Input() public items!:IMediaItem[];
  @Input() mediaType!:MediaType;
}
