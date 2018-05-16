import { Injectable } from '@angular/core';
import { User } from '../classes/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Headers, RequestOptions, Http } from '@angular/http';
import {environment} from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private result: any;
  private headers: HttpHeaders;
  private options: any;
  private apiUrl ='http://'+environment.serverIp+':3000/';

  constructor(private _http: HttpClient, private http: Http) {
    this.headers =  new HttpHeaders({ 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' });
    this.options = { headers: this.headers };
  }

  /**
   * Resgistration of new user
   * @param user User Object
   */
  registerUser(user:User){
    let body = user;
    return this._http.post(this.apiUrl + 'mongodb/users',body,this.options);
  }

  /**
   * Getting usere bases on username and password
   * @param user User Object
   */
  getUser(user:User){
    return this._http.get(this.apiUrl + 'mongodb/users?handle='+user.handle+'&password='+user.password+'&select=handle,displayName');
  }

  /**
   * Getting handlers and display names
   */
  getHandlers(){
    return this._http.get(this.apiUrl + 'mongodb/users?select=handle,displayName');
  }

  /**
   * Getting chats from server
   * @param sender current user
   * @param receiver selected receiver
   */
  getChats(sender: string, receiver){
    return this.http.get(this.apiUrl+'chatfiles/'+sender+receiver+'.txt');
  }

}
