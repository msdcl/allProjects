import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoListComponent } from './todo-list/todo-list.component';
import { FormsModule } from '@angular/forms';
import { AddItemToListComponent } from './add-item-to-list/add-item-to-list.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MultiUserComponent } from '../todo-multi-user/multi-user/multi-user.component';
import { TodoMultiUserModule } from '../todo-multi-user/todo-multi-user.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    TodoMultiUserModule,
    RouterModule.forChild([
      {path:'list/:listName',component:AddItemToListComponent},
  
    ])
  ],
  declarations: [TodoListComponent, AddItemToListComponent]
})
export class TodoSingleUserModule { }
