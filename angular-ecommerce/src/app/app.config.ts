import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAuth0 } from '@auth0/auth0-angular';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAuth0({
      domain: 'dev-st0kdjwcuo4iqjyt.us.auth0.com',
      clientId: '79bdcPULhAW7CcHftFg2rET3kYyG2VTK',
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }),
  ],
};
