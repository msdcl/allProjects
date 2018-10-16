import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { UserSlotsComponent } from './user-slots/user-slots.component';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CalendarModule} from 'angular-calendar';

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { FlatpickrModule } from 'angularx-flatpickr';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
   
    
    CalendarModule.forRoot(),
   
    NgbModalModule.forRoot(),
    FlatpickrModule.forRoot(),
    RouterModule.forChild([
      {path:'userSlots/:userId',component:UserSlotsComponent}
    ])
  ],
  declarations: [
    AdminComponent, 
    UserSlotsComponent
]
})
export class SlotsModule { }
