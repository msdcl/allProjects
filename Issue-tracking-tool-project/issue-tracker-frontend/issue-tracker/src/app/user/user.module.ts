import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule } from '@angular/forms';
import {RouterModule} from '@angular/router';

import { PersonalViewComponent } from '../dashboard/personal-view/personal-view.component';
import { DashboardModule } from '../dashboard/dashboard.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DashboardModule,
    RouterModule.forChild([
      {path:'signup',component:SignupComponent},
      {path:'dashboard',component:PersonalViewComponent}
    ])
  ],
  declarations: [LoginComponent, SignupComponent]
})
export class UserModule { }
