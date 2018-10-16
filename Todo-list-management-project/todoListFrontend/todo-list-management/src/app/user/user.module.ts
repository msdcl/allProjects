import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { SignupComponent } from './signup/signup.component';
import { RouterModule } from '@angular/router';
import { TodoListComponent } from '../todo-single-user/todo-list/todo-list.component';
import { TodoSingleUserModule } from '../todo-single-user/todo-single-user.module';
import { ListChoiceComponent } from './list-choice/list-choice.component';
import { MultiUserComponent } from '../todo-multi-user/multi-user/multi-user.component';
import { TodoMultiUserModule } from '../todo-multi-user/todo-multi-user.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TodoSingleUserModule,
    TodoMultiUserModule,
    RouterModule.forChild([
         {path:'signup',component:SignupComponent},
         {path:'addTodoList', component:TodoListComponent},
         {path:'lists', component:ListChoiceComponent},
         {path:'multiUserLists',component:MultiUserComponent}
    ])
  ],
  declarations: [LoginComponent, SignupComponent, ListChoiceComponent]
})
export class UserModule { }
