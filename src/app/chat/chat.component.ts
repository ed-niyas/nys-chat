import { Component, OnInit, AfterViewChecked } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { Params, Router } from '@angular/router';
import { User } from '../classes/user';
import { CommonService } from '../common/common.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
/**
 * Chat component.
 */
export class ChatComponent implements OnInit, AfterViewChecked {

  socket;
  user = new User('', '', '');
  receiver_handle = '';
  message = '';
  chats = [];
  handlers: any;
  feedbackmsg = '';
  feedbackmsg2 = '';
  online_users = [];

  constructor(private router: Router, private objCommonService: CommonService) { }

  ngOnInit(): void {

    this.user.handle = localStorage.getItem('handle');
    this.user.displayName = localStorage.getItem('displayName') != undefined ? localStorage.getItem('displayName') : localStorage.getItem('handle');

    this.socket = socketIo('http://' + environment.serverIp + ':3000');
    this.socket.emit('login', this.user.handle);

    this.getHandlers();
    this.socketHandler();

  }

  socketHandler() {
    //get messages.
    this.socket.on('chat', (data) => {
      if ((data.sender == this.user.handle || data.receiver == this.user.handle) && (this.receiver_handle == data.sender || this.receiver_handle == data.receiver)) {
        this.chats.push(data);
        this.refreshFeedback();
      }
      else if (data.receiver == this.user.handle && this.receiver_handle !== data.sender) {
        this.feedbackmsg2 = 'Received a message from ' + data.sender;
        setTimeout(() => {
          this.feedbackmsg2 = '';
        }, 1000);
      }
      else {
        this.feedbackmsg2 = '';
      }
    });

    //typing in feedback
    this.socket.on('typing', (data) => {
      if (data.sender !== this.user.handle && data.receiver == this.user.handle) {
        if (data.sender == this.receiver_handle) {
          this.feedbackmsg = data.sender + ' is typing..';
        }
        else {
          this.feedbackmsg2 = data.sender + ' is typing..';
        }
      }

    });

    //chat deletion call back event.
    this.socket.on('chatDeleted', (data) => {
      if (data.sender == this.user.handle && data.receiver == this.receiver_handle) {
        this.chats = [];
      }
    });

    //chat deletion call back event.
    this.socket.on('online', (data) => {
      this.online_users = data;
      this.refreshFeedback();
    });

  }

  refreshFeedback() {
    if (this.online_users.includes(this.receiver_handle)) {
      this.feedbackmsg = 'online';
    }
    else {
      this.feedbackmsg = 'offline';
    }
  }

  //getting chat list.
  getHandlers() {
    this.objCommonService.getHandlers().subscribe(res => {
      this.handlers = res;
      let temp_handle = this.user.handle;
      if (this.handlers.length > 0) {
        let index = this.handlers.findIndex(function (element) { return element.handle == temp_handle });
        this.handlers.splice(index, 1);
      }
      if (this.handlers.length > 0) {
        this.receiver_handle = this.handlers[0].handle;
        this.getStoredChats();
      }
    });

  }
  /**
   * Gets stored chats
   */
  getStoredChats() {
    if (this.receiver_handle !== undefined && this.receiver_handle !== '' && this.receiver_handle !== null) {
      this.objCommonService.getChats(this.user.handle, this.receiver_handle).subscribe(res => {
        let chat_string = "[" + res['_body'] + "]";
        chat_string = chat_string.replace(/,([^,]*)$/, '$1');
        try {
          this.chats = JSON.parse(chat_string);

        }
        catch (err) {
          this.chats = [];
        }
      });
    }
    else {
      this.chats = [];
    }

  }

  /**
   * Sending message to socket io
   */
  sendMessage(): void {
    if (this.message !== '' && this.receiver_handle !== '') {
      this.socket.emit('chat', {
        message: this.message,
        sender: this.user.handle,
        receiver: this.receiver_handle
      });
    }
    this.message = '';
  }

  /**
   * Drop down change event fired
   */
  receiverChanged() {
    this.feedbackmsg2 = '';
    this.getStoredChats();
    this.refreshFeedback();
  }

  /**
   * Scroll to bottom
   */
  ngAfterViewChecked() {
    var element = document.getElementById("chat-window");
    element.scrollTop = 9999999;
  }

  /**
   * Keyboard typing fired
   * @param even
   */
  keyDownFunction(event) {
    if (event.keyCode == 13) {
      this.sendMessage();
    }
    else {
      this.socket.emit('typing', { sender: this.user.handle, receiver: this.receiver_handle });
    }
  }

  /**
   * user logout
   */
  logout() {
    this.socket.emit('logout');
    this.router.navigateByUrl('/login');
  }

  /**
   * deletes chats in server
   */
  clearChat() {
    if (this.receiver_handle !== '') {
      this.socket.emit('deletechat', { sender: this.user.handle, receiver: this.receiver_handle });
    }
  }

}
