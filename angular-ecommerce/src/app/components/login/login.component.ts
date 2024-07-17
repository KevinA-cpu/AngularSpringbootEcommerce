import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT, NgIf, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-button',
  imports: [NgIf, AsyncPipe, RouterLink],
  template: `<ng-container
      *ngIf="auth.isAuthenticated$ | async; else loggedOut"
    >
      <div class="d-flex flex-row align-items-center">
        <div class="me-2" *ngIf="auth.user$ | async as user">
          Welcome back, {{ user.name }}
        </div>

        <button
          class="au-btn-submit py-2"
          (click)="
            auth.logout({
              logoutParams: { returnTo: document.location.origin }
            })
          "
        >
          Log out
        </button>

        <button routerLink="/members" class="au-btn-submit py-2 ms-1">
          Member
        </button>

        <button routerLink="/order-history" class="au-btn-submit py-2 ms-1">
          Orders
        </button>
      </div>
    </ng-container>

    <ng-template #loggedOut>
      <button class="au-btn-submit py-2" (click)="auth.loginWithRedirect()">
        Log in
      </button>
    </ng-template>`,
  standalone: true,
})
export class AuthButtonComponent {
  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService
  ) {}
}
