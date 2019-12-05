import { Component } from '@angular/core';
import {environment} from "../environments/environment";
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-chat';
  private env = environment;
  private storageName = this.env.appName + '_session';
  private session = localStorage.getItem(this.storageName);
  public isLoggedIn = this.session !== null && this.session !== '';

  constructor(private authService: AuthService) {
    // console.log(localStorage.getItem(this.storageName) );
  }

  logout() {
    this.authService.logout();
  }
}
