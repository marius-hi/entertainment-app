import { Component, Input, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { IMediaResponseData, IMediaResponseItem, MediaDataService } from '../media-data.service';
import { finalize, map, Observable, Subject, takeUntil } from 'rxjs';
import { MediaListComponent } from '../media-list/media-list.component';
import { MediaType, SCROLL_DISTANCE, SCROLL_THROTTLE } from '../../../app.settings';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { IMediaItem, MediaService } from '../media.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorPrefix, MessageService } from '../../../shared/services/message.service';

@Component({
  selector: 'top-rated-media',
  imports: [
    MediaListComponent,
    InfiniteScrollDirective,
    LoadingSpinnerComponent
  ],
  providers: [
    MediaService,
    MediaDataService,
    MessageService
  ],
  templateUrl: './top-rated-media.component.html',
  standalone: true
})
export class TopRatedMediaComponent implements OnInit, OnDestroy {
  @Input() public mediaType!:MediaType;
  public mediaItems:IMediaItem[] = [];
  private mediaItemsBuffer:IMediaItem[] = [];
  public loading:WritableSignal<boolean> = signal(false);
  private page:WritableSignal<number> = signal(1);
  public scrollDistance:number = SCROLL_DISTANCE;
  public throttle:number = SCROLL_THROTTLE;
  public errorMessage:WritableSignal<string|undefined> = signal(undefined);
  public mediaItemsUnsubscribe$:Subject<IMediaResponseData|undefined> = new Subject<IMediaResponseData|undefined>();

  constructor(
    private mediaService:MediaService,
    private mediaDataService:MediaDataService,
    private messageService:MessageService
  ) {}

  public ngOnInit():void {
    this.loadTopRatedMedia();
  }

  private loadTopRatedMedia(page?:number):void {
    this.loading.set(true);
    const getRatedSubscription:Observable<IMediaResponseData> = this.mediaDataService.getTopRated(this.mediaType, page)
      .pipe(
        takeUntil(this.mediaItemsUnsubscribe$),
        finalize(() => {
          this.loading.set(false);
        })
      );

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

    // handle errors
    getRatedSubscription
      .subscribe({
        error: (error:ErrorEvent) => {
          this.errorMessage.set(this.messageService.formatError(error, ErrorPrefix.LOADING_DATA));
        }
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

  public ngOnDestroy():void {
    this.mediaItemsUnsubscribe$.next(undefined);
    this.mediaItemsUnsubscribe$.complete();

    this.mediaItems = [];
    this.mediaItemsBuffer = [];
  }
}
