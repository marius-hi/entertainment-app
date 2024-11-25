import { Component, Input, OnInit } from '@angular/core';
import { IMediaDataResponse, IMovieItem, ITVShowItem, MediaDataService } from '../media-data.service';
import { finalize } from 'rxjs';
import { MediaListComponent } from '../media-list/media-list.component';


import { MediaType } from '../../../app.settings';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'top-rated-media',
  imports: [
    CommonModule,
    MediaListComponent,
    InfiniteScrollDirective
  ],
  providers: [
    MediaDataService
  ],
  templateUrl: './top-rated-media.component.html',
  standalone: true,
  styleUrl: './top-rated-media.component.scss'
})
export class TopRatedMediaComponent implements OnInit {
  @Input() public mediaType!:MediaType;
  public mediaItems:IMovieItem[]|ITVShowItem[] = [];
  private loading:boolean = false;
  public errorMessage:string = '';
  public scrollDistance:number = 1;
  public throttle:number = 500;
  private page:number = 1;

  constructor(
    private mediaDataService:MediaDataService
  ) {}

  public ngOnInit():void {
    this.loading = true;
    this.mediaDataService.getTopRated(this.mediaType)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe({
        next: (media:IMediaDataResponse) => {
          if(media?.results) {
            this.mediaItems = media.results;
            console.log('L19 - constructor', media.results);

            // this.mediaItems = (this.mediaItems || []).concat(this.fetchExistingRating(mostStarredRepos.items));
          }
        },
        error: this.setError
      });
    };

  /**
   * @method setError
   * @description Method used to handle and set the error provided by the server
   * @param {ErrorEvent} err The error event object
   */
  private setError = (err: ErrorEvent): void => {
    this.errorMessage = err?.error?.message;
    if(!this.errorMessage){
      this.errorMessage = err.message ? `Error: ${err.message}` : 'Error loading data';
    }
  };

  /**
   * @method onScrollDown
   * @description Method used to load more repositories when scrolling down
   */
  public onScrollDown(): void {
    this.page += 1;
    // this.loadMostStarredRepos(this.startDate, this.page);
    console.log('L75 - onScrollDown', this.page);
  }
}
