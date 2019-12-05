import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {throwError} from 'rxjs';
import {retry, catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  env: any;
  sessionName: any;
  token: any;
  userId: any;
  errMessage: any;

  constructor(private http: HttpClient) {
    this.env = environment;
    this.sessionName = this.env.appName + '_session';
    let session = localStorage.getItem(this.sessionName);
    let data = (session !== null) ? JSON.parse(session) : [];
    this.token = data['token'];
    this.userId = data['id'];
    this.errMessage = null;
  }

  login(data) {
    return this.http.post(this.env.apiUrl + 'auth', data).subscribe(res => {
      localStorage.setItem(this.env.appName + '_session', JSON.stringify(res));
      location.href = '/chat';
    }, err => {
      this.errMessage = err.error.message;
      console.error('Error', this.errMessage);

    });
  }

  check(redirectIfAuthenticated = false, redirectIfUnauthenticated = true) {
    if (typeof this.token !== 'undefined' && this.token !== null) {
      this.http.post(this.env.apiUrl + 'auth/check',
        {token: this.token},
        {headers: this._getHeaders()}
      ).pipe(
        retry(1),
        catchError(this._checkErrorResponse)
      ).subscribe(res => {
        if (redirectIfAuthenticated) {
          location.href = '/chat';
        }
      });
    } else {
      if(redirectIfUnauthenticated) {
        location.href = '/';
      }
    }
  }

  logout() {
    localStorage.removeItem(this.sessionName);
    location.href = '/';
  }

  private _checkErrorResponse(err = null) {
    location.href = '/';
    // Required but will never reach this point;
    return throwError('Unauthenticated');
  }

  private _getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    });
  }
}

