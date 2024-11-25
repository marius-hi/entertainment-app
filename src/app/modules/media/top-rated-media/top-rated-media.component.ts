import { Component, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { IMediaResponseData, IMediaResponseItem, MediaDataService } from '../media-data.service';
import { finalize, map, Observable } from 'rxjs';
import { MediaListComponent } from '../media-list/media-list.component';
import { MediaType, SCROLL_DISTANCE, SCROLL_THROTTLE } from '../../../app.settings';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { IMediaItem, MediaService } from '../media.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'top-rated-media',
  imports: [
    MediaListComponent,
    InfiniteScrollDirective,
    LoadingSpinnerComponent
  ],
  providers: [
    MediaService,
    MediaDataService
  ],
  templateUrl: './top-rated-media.component.html',
  standalone: true
})
export class TopRatedMediaComponent implements OnInit {
  @Input() public mediaType!:MediaType;
  public mediaItems:IMediaItem[] = [];
  private mediaItemsBuffer:IMediaItem[] = [];
  public loading:WritableSignal<boolean> = signal(false);
  private page:WritableSignal<number> = signal(1);
  public scrollDistance:number = SCROLL_DISTANCE;
  public throttle:number = SCROLL_THROTTLE;

  constructor(
    private mediaService:MediaService,
    private mediaDataService:MediaDataService
  ) {}

  public ngOnInit():void {
    this.loadTopRatedMedia();
  }

  private loadTopRatedMedia(page?:number):void {
    this.loading.set(true);
    const getRatedSubscription:Observable<IMediaResponseData> = this.mediaDataService.getTopRated(this.mediaType, page)
      .pipe(finalize(() => {
        this.loading.set(false);
      }));

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
