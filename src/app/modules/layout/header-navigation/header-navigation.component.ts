import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FontAwesomeModule, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { APP_NAME, MediaType } from '../../../app.settings';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SearchBoxComponent } from '../search-box/search-box.component';

@Component({
  selector: 'header-navigation',
  imports: [
    FontAwesomeModule,
    RouterLinkActive,
    SearchBoxComponent,
    RouterLink
  ],
  templateUrl: './header-navigation.component.html',
  styleUrl: './header-navigation.component.scss'
})
export class HeaderNavigationComponent implements OnChanges {
  @Input() public searchTerm?:string;
  @Input() public mediaType!:MediaType;

  public appTitle:string = APP_NAME;
  protected readonly faKey:IconDefinition = faKey;
  public routerQueryParameters = {};

  public ngOnChanges(changes:SimpleChanges) {
    if (changes['searchTerm']) {
      this.searchTerm = changes['searchTerm'].currentValue;

      this.routerQueryParameters = {
        search: this.searchTerm
      }
    }
  }
}
