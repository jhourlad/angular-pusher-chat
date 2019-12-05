import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, retry} from "rxjs/operators";
import Pusher from 'pusher-js';
import {throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  /**
   * Variable initialization
   */
  env: any;
  sessionName: any;
  token: any;
  messages: any;
  pusher: any;
  channelName: any;
  channel: any;

  /**
   * Constructor
   * @param msgService
   * @param http
   */
  constructor(private msgService: MessageService, private http: HttpClient) {
    this.env = environment;
    this.sessionName = this.env.appName + '_session';
    let session = localStorage.getItem(this.sessionName);
    let data = (session !== null) ? JSON.parse(session) : null;
    this.token = data !== null ? data['token'] : null;

    // Pusher
    this.channelName = this.env.pusher.channel;
    this.pusher = new Pusher(this.env.pusher.key, {
      cluster: this.env.pusher.cluster,
      forceTLS: this.env.pusher.forceTLS
    });
  }

  listen(event, callback) {
    this.channel = this.pusher.subscribe(this.channelName);
    console.log('subscribed to channel', this.channel);

    this.channel.bind(event, (res) => {
      console.log('pusher event', res);
      callback(res);
    });

    this.channel.bind('pusher:subscription_error', function(err) {
      console.log('pusher error', err);
    });
  }



  /**
   * Get all messages
   */
  fetch() {
    return this.http.get(this.env.apiUrl + 'messages',
      {headers: this._getHeaders()}
    );
  }

  /**
   * Send message to server
   * @param message
   */
  send(data) {
    return this.http.post(this.env.apiUrl + 'messages', data, {headers: this._getHeaders()});
  }


  /**
   * Error callback
   * @param err
   * @private
   */
  private _checkErrorResponse(err = null) {
    return throwError('Unauthenticated');
  }

  /**
   * Construct request headers
   * @private
   */
  private _getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    });
  }
}
