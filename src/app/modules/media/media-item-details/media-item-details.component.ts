import { Component, Input } from '@angular/core';
import { MediaType } from '../../../app.routes';
import { IMediaDataResponse, IMediaDetailsResponse, MediaDataService } from '../media-data.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'media-item-details',
  imports: [],
  providers: [ MediaDataService ],
  standalone: true,
  templateUrl: './media-item-details.component.html',
  styleUrl: './media-item-details.component.scss'
})
export class MediaItemDetailsComponent {
  @Input() mediaType!:MediaType;
  @Input() id!:number;
  public mediaItem?:IMediaDataResponse;
  public loading?:boolean;

  constructor(
    private mediaDataService:MediaDataService
  ) {
  }

  public ngOnInit():void {
    console.log('L15 - ngOnInit', this.mediaType, this.id);
    this.loading = true;
    this.mediaDataService.getDetails(this.mediaType, this.id)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe({
        next: (mediaDetails:IMediaDetailsResponse) => {
          // this.mediaItem = mediaDetails;
        },
        // error: this.setError
      });
  };
}
