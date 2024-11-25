import { Component } from '@angular/core';
import { FontAwesomeModule, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';

import { APP_NAME } from '../../../app.settings';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'header-navigation',
  imports: [
    FontAwesomeModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header-navigation.component.html',
  styleUrl: './header-navigation.component.scss'
})
export class HeaderNavigationComponent {
  public appTitle:string = APP_NAME;
  protected readonly faKey:IconDefinition = faKey;
}
