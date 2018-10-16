import { Component, OnInit, Input } from '@angular/core';
import { SocketService } from '../../socket.service';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  @Input() parentTask:string

  public subTask:string
  public userId;
  public listSubtasks=[]
  constructor(public socket:SocketService, public toastr:ToastrService) { }

  ngOnInit() {
    this.userId =Cookie.get('userId');
    this.subscribeToGetAllSubtasks();
    this.socket.getAllSubtasks()
    .subscribe((data) => {

      if(data.error==true){
        this.toastr.warning("this subtask already exists !!!")
      }else{
        this.listSubtasks= [];

      for (let x in data.list) {
       let taskInfo = JSON.parse(data.list[x])
      //  let temp = { 'createdBy':list[x], 'name': x};

        this.listSubtasks.push(taskInfo);          

      }
      
      console.log(this.listSubtasks);
      }
    
      

    }); 
  }
 public addSubTaskToList=(event)=>{
    if(event.keyCode ==13){
       this.addSubTask();
    }
 }
 public addSubTask = ()=>{
  if(this.subTask){
    let taskInfo = {
      taskName :  this.subTask,
      isDone : false
    }
   
    let data = {
        currList : this.parentTask,
        newItem : JSON.stringify(taskInfo),
        userId: this.userId,
    }
    this.subTask = ""
   this.socket.addSubtask(data);
   }else{
  this.toastr.warning("item can't be empty")
   }
 }

  // subscribing to get all items of list
  public subscribeToGetAllSubtasks :any =()=>{
    console.log("get all subtasks of task")
   
  }
}
