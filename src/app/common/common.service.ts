import { Injectable } from '@angular/core';
import { User } from '../classes/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Headers, RequestOptions } from '@angular/http';
// import * as bcrypt from 'bcrypt-nodejs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private result: any;
  private headers: HttpHeaders;
  private options: any;
  private apiUrl ='http://localhost:3000/mongodb';

  constructor(private _http: HttpClient) {
    this.headers =  new HttpHeaders({ 'Content-Type': 'application/json','Access-Control-Allow-Origin':'*' });
    this.options = { headers: this.headers };
  }

  registerUser(user:User){
    let body = user;
    return this._http.post(this.apiUrl + '/users',body,this.options);
  }

  getUser(user:User){
    return this._http.get(this.apiUrl + '/users?handle='+user.handle+'&password='+user.password+'&select=handle,displayName');
  }

  getHandlers(){
    return this._http.get(this.apiUrl + '/users?select=handle,displayName');
  }

}
