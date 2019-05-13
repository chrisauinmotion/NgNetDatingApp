import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SERVER_TRANSITION_PROVIDERS } from '@angular/platform-browser/src/browser/server-transition';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              return throwError(error.statusText);
            }
            const applicationError = error.headers.get('Application-Error');
            if (applicationError) {
              console.log(applicationError);
              return throwError(applicationError);
            }
            const serverError = error.error;
            let modelStateErrors = '';
            if (serverError && typeof serverError === 'object') {
              const errorObj = serverError.errors;
              for (const key in errorObj) {
                if (errorObj[key]) {
                  modelStateErrors += errorObj[key][0] + '\n';
                }
              }
            }
            return throwError(modelStateErrors || serverError || 'Server Error');
          }
        })
      );
  }
}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true
};
