import { Component, OnInit } from '@angular/core';
import { User } from '../classes/user';
import { CommonService } from '../common/common.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user = new User('', '', '');
  public errorMsg = '';

  constructor(private router: Router, private objCommonService: CommonService) { }

  ngOnInit() {
    localStorage.clear();
  }

  /**login click event */
  login() {
    this.objCommonService.getUser(this.user).subscribe(res => {
      var result = res[0];
      if (result != undefined) {
        if (result['displayName'] != undefined && result['displayName'] != null && result['displayName'] != '') {
          localStorage.setItem('displayName', result['displayName']);
          localStorage.setItem('handle', result['handle']);
          this.router.navigateByUrl('/chat');
        }
      }
      else {
        this.errorMsg = 'Invalid credentials.';
      }

    });
  }
}
