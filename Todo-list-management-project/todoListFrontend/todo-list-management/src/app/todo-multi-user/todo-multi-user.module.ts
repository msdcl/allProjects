import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiUserComponent } from './multi-user/multi-user.component';
import { FormsModule } from '@angular/forms';
import { AddTaskListComponent } from './add-task-list/add-task-list.component';
import { RouterModule } from '@angular/router';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {path:'multiUserList/:listName',component:AddTaskListComponent}
    ])
  ],
  declarations: [MultiUserComponent, AddTaskListComponent]
})
export class TodoMultiUserModule { }
