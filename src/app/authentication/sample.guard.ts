import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class SampleGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot) {

    if(localStorage.getItem('handle')!=undefined && localStorage.getItem('handle')!='' && localStorage.getItem('handle')!=null){
        return true;
    }
    else{
        this.router.navigate(['/login']);
        return false;
    }

}
}
