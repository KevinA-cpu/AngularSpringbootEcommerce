import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, lastValueFrom, Observable } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.handleAccess(req, next));
  }

  private async handleAccess(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Promise<HttpEvent<any>> {
    // Add your code here
    const secureEndpoints = ['http://localhost:8080/api/orders'];
    if (secureEndpoints.some((url) => req.urlWithParams.includes(url))) {
      this.auth.getAccessTokenSilently().subscribe((token) => {
        req = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
      });
    }

    return await lastValueFrom(next.handle(req));
  }
}
