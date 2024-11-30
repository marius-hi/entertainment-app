import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MediaType, SEARCH_DEBOUNCE_TIME, SEARCH_START_MIN_CHARACTERS } from '../../../app.settings';

interface ISearchForm {
  searchTerm:FormControl<string>;
}

@Component({
  selector: 'search-box',
  imports: [
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './search-box.component.html'
})
export class SearchBoxComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public mediaType!:MediaType;
  @Input() public searchTerm?:string;

  private routerSubscription:Subscription = new Subscription();
  public searchPlaceholder = 'Search';

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
    if (changes['mediaType']) {
      this.mediaType = changes['mediaType'].currentValue;
      // update the placeholder with a custom text
      this.setPlaceholder();
    }

    if (changes['searchTerm']) {
      this.searchTerm = changes['searchTerm'].currentValue;
      // update the input with the new value from query
      this.searchFormGroup.get('searchTerm')?.setValue(this.searchTerm);
    }

  }

  private listen():void {
    // watch for search input
    this.searchFormGroup.get('searchTerm')?.valueChanges
      .pipe(debounceTime(SEARCH_DEBOUNCE_TIME))
      .subscribe((searchTerm:string) => {
        // clear search query
        if(!searchTerm){
          this.router.navigate([]);
        }

        if(searchTerm?.length){
          this.addSearchTermToQuery(searchTerm);
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

    this.searchPlaceholder = `${this.searchPlaceholder} (min ${SEARCH_START_MIN_CHARACTERS} characters)`;
  }

  public ngOnDestroy():void {
    this.routerSubscription.unsubscribe();
  }
}
