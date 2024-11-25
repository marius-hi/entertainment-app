import { Component, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { FontAwesomeModule, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';

import { APP_NAME } from '../../../app.settings';
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
  @Input() public searchQuery?:string;
  public appTitle:string = APP_NAME;
  protected readonly faKey:IconDefinition = faKey;
  public routerQueryParameters = {};

  public ngOnChanges(changes:SimpleChanges) {
    if (changes['searchQuery']) {
      this.searchQuery = changes['searchQuery'].currentValue;

      this.routerQueryParameters = {
        search: this.searchQuery
      }
    }
  }
}

