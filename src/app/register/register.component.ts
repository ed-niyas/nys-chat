import { Component, OnInit } from '@angular/core';
import { User } from '../classes/user';
import { CommonService } from '../common/common.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user = new User('', '', '');
  displayNameErrorMsg = '';
  handleErrorMsg = '';
  passwordErrorMsg = '';

  constructor(private objCommonService: CommonService, private router: Router) { }

  ngOnInit() {

  }

  register(): void {

    this.displayNameErrorMsg= this.handleErrorMsg = this.passwordErrorMsg ='';

    if (this.user.displayName === '') {
      this.displayNameErrorMsg = 'Required';
    }
    if (this.user.handle === '') {
      this.handleErrorMsg = 'Required';
    }
    else if(this.user.handle[0]!=='@'){
      this.handleErrorMsg = 'Handle should start with @';
    }
    else if(this.user.handle.length<4){
      this.handleErrorMsg = 'Handle should have minimum 3 letters';
    }
    else if(this.user.handle.slice(1).includes('@')){
      this.handleErrorMsg = '@ is allowed only in the starting';
    }
    if (this.user.password === '') {
      this.passwordErrorMsg = 'Required';
    }

    if(this.displayNameErrorMsg === '' && this.handleErrorMsg ==='' && this.passwordErrorMsg ===''){
      this.objCommonService.registerUser(this.user).subscribe(res => {
        console.log(res);
        if (res['_id'] != undefined) {
          localStorage.setItem('handle', res['handle']);
          localStorage.setItem('displayName', res['displayName']);
          this.router.navigateByUrl('/chat');
        }
        else {
          this.handleErrorMsg = 'Handle not available.';
        }
      });
    }
    
  }



}
