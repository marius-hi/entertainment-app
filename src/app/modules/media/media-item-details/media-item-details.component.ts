import { Component, Input, OnInit } from '@angular/core';
import { MediaType } from '../../../app.settings';
import { finalize } from 'rxjs';
import { IMediaItem, MediaService } from '../media.service';
import { MediaItemComponent } from '../media-item/media-item.component';
import { IMediaResponseItemDetails, MediaDataService } from '../media-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'media-item-details',
  providers: [
    MediaService,
    MediaDataService
  ],
  standalone: true,
  templateUrl: './media-item-details.component.html',
  imports: [
    CommonModule,
    MediaItemComponent
  ],
  styleUrl: './media-item-details.component.scss'
})
export class MediaItemDetailsComponent implements OnInit {
  @Input() mediaType!:MediaType;
  @Input() id!:number;
  public mediaItem?:IMediaItem;
  public loading?:boolean;

  constructor(
    private mediaService:MediaService,
    private mediaDataService:MediaDataService
  ) {}

  public ngOnInit():void {
    this.loading = true;
    this.mediaDataService.getDetails(this.mediaType, this.id)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe({
        next: (mediaDetails:IMediaResponseItemDetails) => {
          if(mediaDetails){
            const mediaData:IMediaItem[] = this.mediaService.parseMediaData([ mediaDetails ], this.mediaType);
            this.mediaItem = mediaData.length ? mediaData[0] : <any>{};
          }
        }
      });
  };
}
