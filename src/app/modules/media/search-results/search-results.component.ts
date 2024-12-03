import { Component, Input, OnChanges, OnDestroy, signal, SimpleChanges, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, map, Subject, takeUntil } from 'rxjs';
import { IMediaResponseData, IMediaResponseItem, MediaDataService } from '../media-data.service';
import { MediaType, SCROLL_DISTANCE, SCROLL_THROTTLE, SEARCH_START_MIN_CHARACTERS } from '../../../app.settings';
import { IMediaItem, MediaService } from '../media.service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { MediaListComponent } from '../media-list/media-list.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorPrefix, MessageService } from '../../../shared/services/message.service';

@Component({
  selector: 'search-results',
  imports: [
    InfiniteScrollDirective,
    MediaListComponent,
    LoadingSpinnerComponent
  ],
  providers: [
    MediaService,
    MediaDataService,
    MessageService
  ],
  standalone: true,
  templateUrl: './search-results.component.html'
})
export class SearchResultsComponent implements OnChanges, OnDestroy {
  @Input() mediaType!:MediaType;
  @Input() searchTerm?:string;

  public mediaItems:IMediaItem[] = [];
  public loading:WritableSignal<boolean> = signal(false);
  private page:WritableSignal<number> = signal(1);
  public scrollDistance:number = SCROLL_DISTANCE;
  public throttle:number = SCROLL_THROTTLE;
  public errorMessage:WritableSignal<string|undefined> = signal(undefined);
  public searchTermMinCharacters:number = SEARCH_START_MIN_CHARACTERS;
  public searchUnsubscribe$:Subject<IMediaResponseData|undefined> = new Subject<IMediaResponseData|undefined>();

  constructor(
    private router:Router,
    private mediaService:MediaService,
    private mediaDataService:MediaDataService,
    private messageService:MessageService
  ) {}

  public ngOnChanges(changes:SimpleChanges) {
    // when there is a search term and media type changes -> perform a new search with the new media type
    if (changes['mediaType']) {
      this.mediaType = changes['mediaType'].currentValue;
      if(changes['mediaType'].previousValue && changes['mediaType'].previousValue !== changes['mediaType'].currentValue) {
        this.mediaItems = [];

        if(this.searchTerm) {
          this.startSearch();
        }
      }
    }

    // perform a new search when the search term changes
    if (changes['searchTerm']) {
      this.searchTerm = changes['searchTerm'].currentValue;
      this.mediaItems = []; // clear previous items
      this.errorMessage.set(undefined);

      if(this.searchTerm && this.searchTerm?.length >= this.searchTermMinCharacters) {
        this.startSearch();
      }
    }
  }

  private startSearch(page?:number):void {
    this.loading.set(true);
    this.mediaDataService.searchMedia(this.searchTerm?.trim() || '', this.mediaType, page)
      .pipe(
        takeUntil(this.searchUnsubscribe$),
        finalize(() => {
          this.loading.set(false);
        }),
        map((mediaResponseData:IMediaResponseData) => mediaResponseData.results)
      )
      .subscribe({
        next: (IMediaResponseItem:IMediaResponseItem[]) => {
          this.mediaItems = (this.mediaItems || []).concat(this.mediaService.parseMediaData(IMediaResponseItem, this.mediaType));
        },
        error: (error:ErrorEvent) => {
          this.errorMessage.set(this.messageService.formatError(error, ErrorPrefix.SEARCHING_DATA));
        }
      });
  }

  public onScrollDown(): void {
    this.page.set(this.page() + 1);
    this.startSearch(this.page());
  }

  public ngOnDestroy():void {
    this.searchUnsubscribe$.next(undefined);
    this.searchUnsubscribe$.complete();

    this.mediaItems = [];
  }
}
