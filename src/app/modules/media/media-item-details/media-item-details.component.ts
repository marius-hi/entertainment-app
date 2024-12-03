import { Component, Input, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { MediaType } from '../../../app.settings';
import { finalize, Subject, takeUntil } from 'rxjs';
import { IMediaItem, MediaService } from '../media.service';
import { MediaItemComponent } from '../media-item/media-item.component';
import { IMediaResponseItemDetails, MediaDataService } from '../media-data.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorPrefix, MessageService } from '../../../shared/services/message.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'media-item-details',
  providers: [
    MediaService,
    MediaDataService,
    MessageService
  ],
  standalone: true,
  templateUrl: './media-item-details.component.html',
  styleUrl: './media-item-details.component.scss',
  imports: [
    MediaItemComponent,
    LoadingSpinnerComponent,
    DecimalPipe
  ]
})
export class MediaItemDetailsComponent implements OnInit, OnDestroy {
  @Input() mediaType!:MediaType;
  @Input() id!:number;
  public mediaItem?:IMediaItem;
  public loading:WritableSignal<boolean> = signal(false);
  public errorMessage:WritableSignal<string|undefined> = signal(undefined);
  public mediaItemDetailsUnsubscribe$:Subject<IMediaResponseItemDetails|undefined> = new Subject<IMediaResponseItemDetails|undefined>();

  constructor(
    private mediaService:MediaService,
    private mediaDataService:MediaDataService,
    private messageService:MessageService
  ) {}

  public ngOnInit():void {
    this.loading.set(true);
    this.mediaDataService.getDetails(this.mediaType, this.id)
      .pipe(
        takeUntil(this.mediaItemDetailsUnsubscribe$),
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe({
        next: (mediaDetails:IMediaResponseItemDetails) => {
          this.errorMessage.set(undefined);
          if(mediaDetails){
            const mediaData:IMediaItem[] = this.mediaService.parseMediaData([ mediaDetails ], this.mediaType);
            this.mediaItem = mediaData.length ? mediaData[0] : undefined;
          }
        },
        error: (error:ErrorEvent) => {
          this.errorMessage.set(this.messageService.formatError(error, ErrorPrefix.LOADING_DATA));
        }
      });
  };

  public ngOnDestroy():void {
    this.mediaItemDetailsUnsubscribe$.next(undefined);
    this.mediaItemDetailsUnsubscribe$.complete();

    this.mediaItem = undefined;
  }
}
