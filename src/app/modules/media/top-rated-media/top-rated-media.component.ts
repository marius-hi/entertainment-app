import { Component, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { IMediaResponseData, IMediaResponseItem, MediaDataService } from '../media-data.service';
import { finalize, map, Observable } from 'rxjs';
import { MediaListComponent } from '../media-list/media-list.component';
import { MediaType } from '../../../app.settings';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { CommonModule } from '@angular/common';
import { IMediaItem, MediaService } from '../media.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'top-rated-media',
  imports: [
    CommonModule,
    MediaListComponent,
    InfiniteScrollDirective,
    MatProgressSpinner
  ],
  providers: [
    MediaService,
    MediaDataService
  ],
  templateUrl: './top-rated-media.component.html',
  standalone: true,
  styleUrl: './top-rated-media.component.scss'
})
export class TopRatedMediaComponent implements OnInit {
  @Input() public mediaType!:MediaType;
  public mediaItems:IMediaItem[] = [];
  public loading:boolean = false;
  public errorMessage:string = '';
  public scrollDistance:number = 1;
  public throttle:number = 500;
  private page:WritableSignal<number> = signal(1);
  private mediaItemsBuffer:IMediaItem[] = [];

  constructor(
    private mediaService:MediaService,
    private mediaDataService:MediaDataService
  ) {}

  public ngOnInit():void {
    this.loadTopRatedMedia();
  }

  private loadTopRatedMedia(page?:number):void {
    this.loading = true;
    const getRatedSubscription:Observable<IMediaResponseData> = this.mediaDataService.getTopRated(this.mediaType, page)
      .pipe(finalize(() => {
        this.loading = false;
      }))

    // take the first 10 media results
    getRatedSubscription
      .pipe(
        map((mediaResponseData:IMediaResponseData) => mediaResponseData.results),
        map((mediaItems:IMediaResponseItem[]) => mediaItems.slice(0, 10))
      )
      .subscribe((data:IMediaResponseItem[]) => {
        this.mediaItems = (this.mediaItems || []).concat(this.mediaService.parseMediaData(data, this.mediaType));
      });

    // save the next 10 media results in a buffer
    getRatedSubscription
      .pipe(
        map((mediaResponseData:IMediaResponseData) => mediaResponseData.results),
        map((mediaItems:IMediaResponseItem[]) => mediaItems.slice(10, 20))
      )
      .subscribe((mediaItems:IMediaResponseItem[]) => {
        this.mediaItemsBuffer = this.mediaService.parseMediaData(mediaItems, this.mediaType);
      });
  }

  /**
   * @method onScrollDown
   * @description Method used to load more repositories when scrolling down
   */
  public onScrollDown(): void {
    if(this.mediaItemsBuffer.length) {
      this.mediaItems = (this.mediaItems || []).concat(this.mediaItemsBuffer);
      this.mediaItemsBuffer = [];
    }  else {
      this.page.set(this.page() + 1);
      this.loadTopRatedMedia(this.page());
    }
  }
}
