import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { IMovieItem, ITVShowItem } from '../media-data.service';
import { DatePipe, DecimalPipe, JsonPipe } from '@angular/common';
import { MediaType } from '../../../app.routes';
import { IMediaItem, MediaItemService } from './media-item.service';
import { MatChip } from '@angular/material/chips';
import { Router } from '@angular/router';

@Component({
  selector: 'media-item',
  imports: [
    MatCardModule,
    JsonPipe,
    MatChip,
    DecimalPipe,
    DatePipe
  ],
  providers: [
    MediaItemService
  ],
  standalone: true,
  templateUrl: './media-item.component.html',
  styleUrl: './media-item.component.scss'
})
export class MediaItemComponent implements OnChanges {
  @Input() public item!:IMovieItem|ITVShowItem;
  @Input() public mediaType!:MediaType;
  public model!:IMediaItem;

  constructor(
    private router:Router,
    private mediaItemService:MediaItemService
  ) {}

  public ngOnChanges(changes:SimpleChanges): void {
    if (changes['item']) {
      this.item = changes['item'].currentValue;
      this.model = this.mediaItemService.parseMediaData(this.item, this.mediaType);
    }
  }

  public onClick(model:IMediaItem):void {
    this.router.navigate([`/movie/detail/${model?.id}`]);
  }
}
