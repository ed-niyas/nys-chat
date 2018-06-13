import { Component, OnInit, AfterViewChecked } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { Router } from '@angular/router';
import { User } from '../classes/user';
import { CommonService } from '../common/common.service';
import { environment } from '../../environments/environment';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DevicePopup } from '../pop-ups/device.popup';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
/**
 * Chat component.
 */
export class ChatComponent implements OnInit, AfterViewChecked {

  socket;/**socket connection */
  user = new User('', '', '');/**current user */
  receiver_handle = '';/**handle of current receiver */
  message = '';/**current text in message box */
  chats = [];/**chat loaded */
  handlers: any;/** list of handler available to chat */
  feedbackmsg = '';/** status(online, offline or typing..) */
  feedbackmsg2 = '';/**for typing or notification of message from handlers which are not chosen */
  online_users = [];/**list useres who are online */
  constructor(private router: Router, private objCommonService: CommonService, public dialog: MatDialog) { }

  ngOnInit(): void {

    this.user.handle = localStorage.getItem('handle');
    this.user.displayName = localStorage.getItem('displayName') != undefined ? localStorage.getItem('displayName') : localStorage.getItem('handle');
    this.socket = socketIo('http://' + environment.serverIp + ':3000');

    this.socketHandler();
    this.getHandlers();    
    
    this.socket.emit('prelogin', this.user.handle);
  }

  /**Emitting event after succesull login */
  Login() {
    this.socket.emit('login', this.user.handle);
  }

  /**All socket-io events are handled here */
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
        if (data.status) {
          if (data.sender == this.receiver_handle) {
            this.feedbackmsg = data.sender + ' is typing..';
          }
          else {
            this.feedbackmsg2 = data.sender + ' is typing..';
          }
        }
        else {
          if (data.sender !== this.receiver_handle) {
            this.feedbackmsg2 = '';
          }
          this.refreshFeedback();
        }
      }

    });

    //chat deletion call back event.
    this.socket.on('chatDeleted', (data) => {
      if (data.sender == this.user.handle && data.receiver == this.receiver_handle) {
        this.chats = [];
      }
    });

    //receiving current receiver status.
    this.socket.on('online', (data) => {
      this.online_users = data;
      this.refreshFeedback();
    });

    //logging out remotely.
    this.socket.on('logmeout', (data) => {
      // if (this.socket.id !== data.socket && this.user.handle === data.handle) {
        this.logout();
      // }
    });

    //allowing login.
    this.socket.on('allowlogin', (data) => {
      this.Login();
    });

    //logging out remotely.
    this.socket.on('logdeviceout', (device_data) => {
        let dialogRef = this.dialog.open(DevicePopup, {
          width: '400px',
          height: '275px',
          data: { device_ips: device_data, remove_ips: [false, false, false] }
        });

        const sub = dialogRef.componentInstance.onSave.subscribe((data) => {
          if (data !== null) {
            this.objCommonService.updateDevices(this.user.handle, { device_ips: data }).subscribe(res => {
              this.socket.emit('prelogin', this.user.handle);
            });
          }
          else{
            this.logout();
          }
        });
    });
  }

  //refreshes current receiver status
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
    if (this.message !== '\n' && this.message !== '' && this.receiver_handle !== '') {
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
      this.socket.emit('typing', { sender: this.user.handle, receiver: this.receiver_handle, status: true });
      clearTimeout(timeout);
      var timeout = setTimeout(() => {
        this.socket.emit("typing", { sender: this.user.handle, receiver: this.receiver_handle, status: false });
      }, 3000);

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
