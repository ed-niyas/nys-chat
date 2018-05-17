import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';
import { SampleGuard } from './authentication/sample.guard';


export const RouteConfig: Routes = [
      { path:'',  redirectTo: '/chat', pathMatch: 'full'},
      { path:'register', component: RegisterComponent},
      { path:'login', component: LoginComponent},
      { path: 'chat', component: ChatComponent, canActivate:[SampleGuard]},
      { path: '**', pathMatch: 'full', redirectTo: '/login' }
];
