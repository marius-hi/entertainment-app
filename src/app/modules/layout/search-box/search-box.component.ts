import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { ActivationEnd, Router } from '@angular/router';
import { MediaType } from '../../../app.settings';

interface ISearchForm {
  searchTerm:FormControl<string>;
}

@Component({
  selector: 'search-box',
  imports: [
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.scss'
})
export class SearchBoxComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public searchTerm?:string;

  private routerSubscription:Subscription = new Subscription();
  private mediaType?:MediaType;
  public searchPlaceholder:string = 'Search';

  constructor(
    public router:Router
  ) {}

  public searchFormGroup:FormGroup = new FormGroup<ISearchForm>({
    searchTerm: new FormControl('', {
      nonNullable: true
    })
  });

  public ngOnInit():void {
    this.listen();
  }

  public ngOnChanges(changes:SimpleChanges) {
    if (changes['searchTerm']) {
      this.searchTerm = changes['searchTerm'].currentValue;
      // update the input with the new value from query
      this.searchFormGroup.get('searchTerm')?.setValue(this.searchTerm);
    }
  }

  private listen():void {
    // watch for search input
    this.searchFormGroup.get('searchTerm')?.valueChanges
      .pipe(debounceTime(1000))
      .subscribe((searchTerm:string) => {
        // clear search query
        if(!searchTerm){
          this.router.navigate([]);
        }

        // perform search when min 3 characters
        if(searchTerm?.length >= 3){
          this.addSearchTermToQuery(searchTerm);
        }
      });

    // fetch the type of media that is rendered
    this.routerSubscription = this.router.events
      .subscribe((event) => {
        if (event instanceof ActivationEnd) {
          if(event?.snapshot?.data['mediaType']){
            this.mediaType = event?.snapshot?.data['mediaType'];
            this.setPlaceholder();
          }
        }
      });
  }

  private addSearchTermToQuery(searchTerm:string):void {
    this.router.navigate([], {
      queryParams: { search: searchTerm },
      queryParamsHandling: 'merge'
    });
  }

  private setPlaceholder():void {
    if(this.mediaType === MediaType.MOVIE){
      this.searchPlaceholder = 'Search a Movie';
    } else if(this.mediaType === MediaType.TV_SHOW){
      this.searchPlaceholder = 'Search a TV Show';
    }

    this.searchPlaceholder = `${this.searchPlaceholder} (min 3 characters)`;
  }

  public ngOnDestroy():void {
    this.routerSubscription.unsubscribe();
  }
}
