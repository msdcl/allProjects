import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { SlotsModule } from '../slots/slots.module';
import { AdminComponent } from '../slots/admin/admin.component';
import { UserSlotsComponent } from '../slots/user-slots/user-slots.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SlotsModule,
    RouterModule.forChild([
      {path:'signup',component:SignupComponent},
      {path:'slotManagement/admin/:userId',component:AdminComponent},
      {path:'userSlots/:userId',component:UserSlotsComponent}
    ])
  ],
  declarations: [LoginComponent, SignupComponent]
})
export class UserModule { }
