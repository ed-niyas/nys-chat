import { Component, OnInit } from '@angular/core';
import {User} from '../classes/user';
import {CommonService} from '../common/common.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private user = new User('','','');
  private errorMsg = '';

  constructor(private objCommonService: CommonService, private router: Router) { }

  ngOnInit() {
  }

  register():void{
    this.objCommonService.registerUser(this.user).subscribe(res=>{
      debugger
      console.log(res);
      if(res['_id'] !=undefined){
        localStorage.setItem('handle', res['handle']);
        let redirec_url= '/chat/'+res['handle'];
        this.router.navigateByUrl(redirec_url);
      }
      else{
        this.errorMsg = 'handle not available.';
      }
    });
  }



}
