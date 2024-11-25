import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import { IValidateTokenErrorResponse, IValidateTokenResponse, WizardDataService } from './wizard-data.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { AuthService } from '../../shared/services/auth.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';

interface IWizardForm {
  token:FormControl<string>;
}

@Component({
  selector: 'wizard',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCard,
    ReactiveFormsModule,
    MatCardContent,
    MatCardActions,
    MatButton,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatProgressSpinner,
    RouterLink
  ],
  providers: [
    WizardDataService,
    LocalStorageService
  ],
  templateUrl: './wizard.component.html',
  styleUrl: './wizard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizardComponent implements OnInit {
  public wizardForm:FormGroup = new FormGroup<IWizardForm>({
    token: new FormControl('', {
      validators: [
        Validators.required
      ],
      nonNullable: true
    })
  });

  public matcher:ErrorStateMatcher = new ErrorStateMatcher();
  public busy?:boolean;
  public hasValidToken!:boolean;

  constructor(
    private router:Router,
    private wizardDataService:WizardDataService,
    private localStorage:LocalStorageService,
    private authService:AuthService
  ) {
  }

  public ngOnInit():void {
    this.hasValidToken = this.authService.hasValidToken;
    if(this.hasValidToken) {
      this.token?.setValue(this.authService.token);
    }
  }

  public submit():void {
    const token:string = this.token?.value;

    this.busy = true;
    this.wizardDataService.validateToken(token)
      .pipe(finalize(() => {
        this.busy = false;
      }))
      .subscribe({
        next: (successResponse:IValidateTokenResponse) => {
          if (successResponse?.success) {
            // set validated token and redirect to home
            this.hasValidToken = true;
            this.authService.token = token;
            this.router.navigate([ '/' ]);
          }
        },
        error: (errorResponse:IValidateTokenErrorResponse) => {
          this.token?.setErrors({
            invalidToken: errorResponse?.error?.status_message
          });
        }
      });
  }

  public get token():null | AbstractControl<any, any> {
    return this.wizardForm.get('token');
  }
}
