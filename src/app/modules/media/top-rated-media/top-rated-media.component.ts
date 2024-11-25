import { Component, Input, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IMediaDataResponse, IMovieItem, ITVShowItem, MediaDataService } from '../media-data.service';
import { MediaType } from '../../../app.routes';
import { finalize } from 'rxjs';
import { MediaListComponent } from '../media-list/media-list.component';

@Component({
  selector: 'top-rated-media',
  imports: [
    RouterOutlet,
    MediaListComponent
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
}
