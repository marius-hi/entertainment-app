import { Component, Input, OnChanges, signal, SimpleChanges, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, map, Observable } from 'rxjs';
import { IMediaResponseData, IMediaResponseItem, MediaDataService } from '../media-data.service';
import { MediaType, SCROLL_DISTANCE, SCROLL_THROTTLE } from '../../../app.settings';
import { IMediaItem, MediaService } from '../media.service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { MediaListComponent } from '../media-list/media-list.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'search-results',
  imports: [
    InfiniteScrollDirective,
    MediaListComponent,
    LoadingSpinnerComponent
  ],
  providers: [
    MediaService,
    MediaDataService
  ],
  standalone: true,
  templateUrl: './search-results.component.html'
})
export class SearchResultsComponent implements OnChanges {
  @Input() mediaType!:MediaType;
  @Input() searchTerm?:string;

  public mediaItems:IMediaItem[] = [];
  public loading:WritableSignal<boolean> = signal(false);
  private page:WritableSignal<number> = signal(1);
  public scrollDistance:number = SCROLL_DISTANCE;
  public throttle:number = SCROLL_THROTTLE;

  constructor(
    private router:Router,
    private mediaService:MediaService,
    private mediaDataService:MediaDataService
  ) {}

  public ngOnChanges(changes:SimpleChanges) {
    // when there is a search term and media type changes -> perform a new search with the new media type
    if (changes['mediaType']) {
      this.mediaType = changes['mediaType'].currentValue;
      if(changes['mediaType'].previousValue && changes['mediaType'].previousValue !== changes['mediaType'].currentValue) {
        this.mediaItems = [];
        this.startSearch();
      }
    }

    // perform a new search when the search term changes
    if (changes['searchTerm']) {
      this.searchTerm = changes['searchTerm'].currentValue;
      this.mediaItems = []; // clear previous items

      if(this.searchTerm) {
        this.startSearch();
      }
    }
  }

  private startSearch(page?:number):void {
    this.loading.set(true);
    const searchSubscription:Observable<IMediaResponseData> = this.mediaDataService.searchMedia(this.searchTerm?.trim() || '', this.mediaType, page)
      .pipe(finalize(() => {
        this.loading.set(false);
      }));

    searchSubscription
      .pipe(
        map((mediaResponseData:IMediaResponseData) => mediaResponseData.results)
      )
      .subscribe((IMediaResponseItem:IMediaResponseItem[]) => {
        this.mediaItems = (this.mediaItems || []).concat(this.mediaService.parseMediaData(IMediaResponseItem, this.mediaType));
      });
  }

  public onScrollDown(): void {
    this.page.set(this.page() + 1);
    this.startSearch(this.page());
  }
}
