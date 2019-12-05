import { Component, OnInit } from '@angular/core';
import {FormControl, FormControlName, FormGroup, Validators} from '@angular/forms';
import {AuthService} from "../../services/auth.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  /**
   * Initialize variables
   */
  private env = environment;

  /**
   * Constructor
   * @param authService
   */
  constructor(public authService: AuthService) {
    this.authService.check(true, false);
  }

  /**
   * Construct login form
   */
  public loginForm = new FormGroup({
    username: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(25),
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(25),
    ])
  });


  /**
   * Username control getter
   */
  get username() {
    return this.loginForm.get('username');
  }

  /**
   * Password control getter
   */
  get password() {
    return this.loginForm.get('password');
  }

  /**
   * Init
   */
  ngOnInit() {
  }

  /**
   * Form submit handler
   */
  onSubmit() {
    if( !this.loginForm.valid ) {
      console.error(this.loginForm.errors);
      return;
    }
    console.log('submitting', this.loginForm.value);
    this.authService.login(this.loginForm.value);
  }
}

