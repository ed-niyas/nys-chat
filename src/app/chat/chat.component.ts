import { Component, OnInit } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from '../classes/user';
import { CommonService } from '../common/common.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private socket;
  private user= new User('','','');
  private receiver_handle='';
  private message='';
  private chats=[];
  private handlers: any;

  constructor(private router: Router,private activatedRoute: ActivatedRoute, private objCommonService: CommonService){

  }

  ngOnInit(): void{
    this.socket= socketIo('http://localhost:3000');

    this.socket.on('chat', (data)=>{
      if(data.sender==this.user.handle || data.receiver== this.user.handle){
        this.chats.push(data);
      }
    });

    this.activatedRoute.params.subscribe((params: Params) => {
      this.user.handle=params.handle;
      this.RouteChanged();
    });

    this.objCommonService.getHandlers().subscribe(res=>{
      this.handlers= res;
      let temp_handle= this.user.handle;
      if(this.handlers.length>0){
        let index = this.handlers.findIndex(function(element){ return element.handle==temp_handle});
        this.handlers.splice(index,1);
      }
      if(this.handlers.length>0){
        this.receiver_handle= this.handlers[0].handle;
      }
    });
  }

  RouteChanged(){
    if(localStorage.getItem('handle')!==this.user.handle){
      localStorage.clear();
      this.router.navigateByUrl('/login');
    }
    else{
      this.user.displayName= localStorage.getItem('displayName')!=undefined? localStorage.getItem('displayName'): this.user.handle;
    }
  }

  sendMessage():void{
    if(this.message!=='' && this.receiver_handle!==''){
      this.socket.emit('chat',{
        message: this.message,
        sender: this.user.handle,
        receiver:this.receiver_handle
      });
    }
    this.message='';
  }

}
