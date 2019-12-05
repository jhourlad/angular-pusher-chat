import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {MessageService} from "../../services/message.service";
import {HttpClient} from "@angular/common/http";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  /**
   * Initialize variables
   */
  errMessage: any;
  messages: any;
  userId: any;

  /**
   * Constructor
   * @param authService
   * @param msgService
   * @param http
   */
  constructor(private authService: AuthService, private msgService: MessageService, private http: HttpClient) {
    this.errMessage = null;
    this.userId = authService.userId;

    // Auth check
    this.authService.check(false, true);
  }


  /**
   * Construct chat form
   */
  public chatForm = new FormGroup({
    message: new FormControl(null, [
      Validators.required,
      Validators.minLength(1)
    ])
  });


  /**
   * Message control getter
   */
  get message() {
    return this.chatForm.get('message');
  }


  /**
   * Init
   */
  ngOnInit() {
    // Get messages
    this.msgService.fetch().subscribe(res => {
      console.log('messages', res);
      this.messages = res;
    });

    // Start listening to pusher event
    this.msgService.listen('App\\Events\\MessageSent', (res) => {
      this.messages.push(res['message']);
    });
  }

  ngAfterViewChecked() {
    this.scrollMessageBottom();
  }

  /**
   * Form submit handler
   */
  onSubmit() {
    if (!this.chatForm.valid) {
      console.error(this.chatForm.errors);
      return;
    }
    console.log('submitting', this.chatForm.value);
    this.msgService.send(this.chatForm.value).subscribe(res => {
      console.log('response', res);
      this.chatForm.reset();
      this.scrollMessageBottom();
    });
  }

  /**
   * Scroll view to bottom of message window
   */
  scrollMessageBottom(): void {
    let el = document.getElementById('messages');
    el.scrollTo(0, el.scrollHeight);
  }
}
