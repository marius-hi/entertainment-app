import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatChip } from '@angular/material/chips';
import { Router } from '@angular/router';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent, IconDefinition } from '@fortawesome/angular-fontawesome';
import { IMediaItem } from '../media.service';

@Component({
  selector: 'media-item',
  imports: [
    MatCardModule,
    MatChip,
    DecimalPipe,
    DatePipe,
    FaIconComponent
  ],
  standalone: true,
  templateUrl: './media-item.component.html',
  styleUrl: './media-item.component.scss'
})
export class MediaItemComponent {
  @Input() public item!:IMediaItem|undefined;
  @Input() public hideRating?:boolean;
  protected readonly faStar:IconDefinition = faStar;

  constructor(
    private router:Router
  ) {}

  public onClick(model:IMediaItem|undefined):void {
    if(model?.urlPageDetail){
      this.router.navigate([model.urlPageDetail], { queryParams: { search: undefined }, replaceUrl: true })
    }
  }
}
