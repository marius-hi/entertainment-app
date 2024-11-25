import { Component, Input } from '@angular/core';
import { GRID_COLUMNS, MediaType } from '../../../app.settings';
import { MediaItemComponent } from '../media-item/media-item.component';
import { IMediaItem } from '../media.service';

@Component({
  selector: 'media-list',
  imports: [
    MediaItemComponent
  ],
  standalone: true,
  templateUrl: './media-list.component.html'
})
export class MediaListComponent {
  @Input() public items!:IMediaItem[];
  @Input() mediaType!:MediaType;
  @Input() loading!:boolean;
  public columns:number = GRID_COLUMNS;

  public get gridColumnClass():string {
    // determine bootstrap cols class based on the selected number of columns
    let gridColumnClassId:number;
    switch(GRID_COLUMNS){
      case 2: gridColumnClassId = 6; break;
      case 3: gridColumnClassId = 4; break;
      case 4: gridColumnClassId = 3; break;
      case 6: gridColumnClassId = 2; break;
      default: gridColumnClassId = 3;
    }
    return `mb-5 col-md-${gridColumnClassId}`;
  }
}
