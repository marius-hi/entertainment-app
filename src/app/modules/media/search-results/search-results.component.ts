import { Component, Input, OnChanges, OnInit, signal, SimpleChanges, WritableSignal } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize, map, Observable } from 'rxjs';
import { IMediaResponseData, IMediaResponseItem, MediaDataService } from '../media-data.service';
import { MediaType } from '../../../app.settings';
import { IMediaItem, MediaService } from '../media.service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MediaListComponent } from '../media-list/media-list.component';

@Component({
  selector: 'search-results',
  imports: [
    CommonModule,
    InfiniteScrollDirective,
    MatProgressSpinner,
    MediaListComponent
  ],
  providers: [
    MediaService,
    MediaDataService
  ],
  standalone: true,
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent implements OnInit, OnChanges {
  @Input() searchTerm?:string;

  public mediaItems:IMediaItem[] = [];
  public loading:boolean = false;
  public scrollDistance:number = 1;
  public throttle:number = 500;
  public mediaType!:MediaType;
  private page:WritableSignal<number> = signal(1);

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private mediaService:MediaService,
    private mediaDataService:MediaDataService
  ) {}

  public ngOnChanges(changes:SimpleChanges) {
    if (changes['searchTerm']) {
      this.searchTerm = changes['searchTerm'].currentValue;
      this.mediaItems = []; // clear previous items

      if(this.searchTerm) {
        this.startSearch();
      }
    }
  }

  public ngOnInit():void {
    // fetch the type of media that is rendered and determine if is changed
    this.router.events
      .subscribe((event) => {
        if (event instanceof ActivationEnd) {
          if(event?.snapshot?.data['mediaType']){
            const mediaTypeChanged:boolean = event?.snapshot?.data['mediaType'] !== this.mediaType;
            this.mediaType = event?.snapshot?.data['mediaType'];
            // when changing the media type, perform a new search with the same query search term
            if(mediaTypeChanged && this.searchTerm){
              this.mediaItems = [];
              this.startSearch();
            }
            this.mediaType = event?.snapshot?.data['mediaType'];
          }
        }
      });
  }

  private startSearch(page?:number):void {
    this.loading = true;
    const searchSubscription:Observable<IMediaResponseData> = this.mediaDataService.searchMedia(this.searchTerm?.trim() || '', this.mediaType, page) // this.mediaType
      .pipe(finalize(() => {
        this.loading = false;
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
