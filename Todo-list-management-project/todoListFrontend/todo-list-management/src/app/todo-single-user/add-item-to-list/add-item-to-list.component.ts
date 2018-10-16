import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from '../../socket.service';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../http.service';

@Component({
  selector: 'app-add-item-to-list',
  templateUrl: './add-item-to-list.component.html',
  styleUrls: ['./add-item-to-list.component.css']
})
export class AddItemToListComponent implements OnInit {

  public currentListName:string;
  public listItems=[];
  public itemName:string;
  public userId = Cookie.get('userId');
  public currTaskId:string;
  public editedName:string
  public parentTaskId:string
  public allSubTasks;
  public subTaskName;
  constructor(public activatedRoute: ActivatedRoute, public location:Location, public router :Router,
                public socket : SocketService,public toastr :ToastrService,public http: HttpService  ) { }

  ngOnInit() {
    this.currentListName = this.activatedRoute.snapshot.paramMap.get('listName');
    this.subscribeToGetAllItemsOfList();
    let data = {
      currList : this.currentListName,
      userId : this.userId
    }
    this.socket.setUser(this.userId)
    //this.socket.alreadyItemsOfList(data);

    // this.socket.addNewTaskToList().subscribe((response)=>{
    //   console.log("using socket")
    //   if(response.error==true){
    //     this.toastr.warning(`Error : ${response.message}`)
    //   }else{

    //     this.toastr.success(`task added successfully !!!`)
    //     let temp = { 'isDone':response.data.isDone, 'taskName': response.data.taskName,'id':response.data.id};

    //     this.listItems.push(temp);     
    //   console.log(this.listItems);
    //   }
    // })
  }
   
    //check status in case cookies get deleted
  public checkStatus: any = () => {

    if (Cookie.get('authtoken') === undefined || Cookie.get('authtoken') === '' || Cookie.get('authtoken') === null) {

      this.router.navigate(['/']);

      return false;

    } else {

      return true;

    }

  }

   // function to add neww item to a list
  public addNewItemToList = (event :any)=>{
    if(event.keyCode === 13){
      this.newItemTOList();
    }
  }

  // add new item to list
  public newItemTOList = ()=>{
    if(this.currentListName){
      
     
      let data = {
          currList : this.currentListName,
          newItem : this.itemName,
          userId: this.userId
      }
      this.itemName = ""
      this.http.addNewTaskToList(data).subscribe((response) => { 
        if(response.error){
          this.toastr.warning(`Error: ${response.message}`,'', { timeOut: 1000 })
        }else{
          let temp = { 'isDone':response.data.isDone, 'taskName': response.data.taskName,'id':response.data.id} ;

          this.listItems.push(temp);   
        }
      });
     
    // this.socket.addItemToList(data);
     }else{
    this.toastr.warning("item can't be empty")
     }
  }

  // subscribing to get all items of list
  public subscribeToGetAllItemsOfList :any =()=>{
    console.log("get all items of lists")
    let data ={
      currList : this.currentListName,
      userId: this.userId
    }
    this.http.getAllTasksOfList(data)
      .subscribe((response) => {

        if(response.error==true){
          this.toastr.error(`Error: ${response.message}`,'', { timeOut: 1000 })
        }else{
          this.listItems= [];

        for (let x in response.data) {
        
          let temp = { 'isDone':response.data[x].isDone, 'taskName': response.data[x].taskName,'id':response.data[x].id} ;

          this.listItems.push(temp);          

        } 
        
        console.log(this.listItems);
        }
      
        

      }); 
  }

  public deleteTaskFromList = (taskId)=>{
   
    
    let data = {
       
        id: taskId,
       
    }
    this.http.deleteTaskOfList(data).subscribe((response) => {

      if(response.error==true){
        this.toastr.error(`Error: ${response.message}`,'', { timeOut: 1000 })
      }else{
        this.toastr.success(`task deleted successfully`)
        this.listItems = this.listItems.filter((item) => item.id !== taskId);
      
      console.log(this.listItems);
      }
    
      

    }); 
   // this.socket.deleteTodoTask(data)
  }

  public markAsDone = (taskId) =>{
    
    let data = {
        isDone : true,
        id: taskId,
    }
  
    this.http.updateTaskOfList(data).subscribe((response) => {

      if(response.error==true){
        this.toastr.error(`Error: ${response.message}`,'', { timeOut: 1000 })
      }else{
        let index = this.listItems.findIndex((obj => obj.id == taskId));
        this.listItems[index].isDone = true;
        this.toastr.success(`task is complete`)
      console.log(this.listItems);
      }
    
      

    }); 
  }

  public markAsIncomplete = (taskId)=>{
    let data = {
      isDone : false,
      id: taskId,
  }
  this.http.updateTaskOfList(data).subscribe((response) => {

    if(response.error==true){
      this.toastr.error(`Error: ${response.message}`,'', { timeOut: 1000 })
    }else{
      let index = this.listItems.findIndex((obj => obj.id == taskId));
      this.listItems[index].isDone = false;
      this.toastr.success(`task is incomplete`)
    console.log(this.listItems);
    }
  
    

  }); 
  }

  public logout= ()=>{
    this.socket.doUserLogOut(this.userId)
    this.router.navigate(['/login'])
  
  }

  public editThisTask=(taskId)=>{
     this.currTaskId =taskId
  }

  public editTaskName=()=>{
    let data = {
      taskName: this.editedName,
      id: this.currTaskId,
  }
  this.http.editTaskName(data).subscribe((response) => {

    if(response.error==true){
      this.toastr.error(`Error: ${response.message}`,'', { timeOut: 1000 })
    }else{
      let index = this.listItems.findIndex((obj => obj.id == this.currTaskId));
      this.listItems[index].taskName = this.editedName
      this.toastr.success(`task name edited`)
    console.log(this.listItems);
    }
  
    

  }); 
  }


  public getAllSubTasks=(parentTaskId)=>{
    this.parentTaskId =parentTaskId
    // alert("get all subtask")
    this.http.getAllSubTaskOfTask(parentTaskId).subscribe((response)=>{
      if(response.error){
        this.toastr.warning(response.message,'', { timeOut: 1000 });
      }else{
         this.allSubTasks=[];
         for (let x in response.data) {
        
          let temp = { 'isDone':response.data[x].isDone, 'taskName': response.data[x].subTask,'id':response.data[x].id} ;

          this.allSubTasks.push(temp);          

        } 
        console.log(this.allSubTasks);
      }
    })
  }

 public addSubtask = (event)=>{
   if(event.keyCode==13){
      this.addNewSubTask()
   }
 }
public addNewSubTask = ()=>{
  if(this.subTaskName){
      
    let data = {
        subTask : this.subTaskName,
        parentId: this.parentTaskId
    }
    this.subTaskName = ""
    this.http.addNewSubTaskToTask(data).subscribe((response) => { 
      if(response.error){
        this.toastr.warning(`Error: ${response.message}`,'', { timeOut: 1000 })
      }else{
        let temp = { 'isDone':response.data.isDone, 'taskName': response.data.subTask,'id':response.data.id};
        this.allSubTasks.push(temp); 
        console.log(this.allSubTasks)
        this.toastr.success("Sub task added !!")
      }
    });
   
  // this.socket.addItemToList(data);
   }else{
  this.toastr.warning("name can't be empty")
   }
}
 public deleteSubTaskFromList = (taskId)=>{
  let data = {
       
    id: taskId,
   
}
this.http.deleteSubTaskOFromList(data).subscribe((response) => {

  if(response.error==true){
    this.toastr.error(`Error: ${response.message}`,'', { timeOut: 1000 })
  }else{
    this.toastr.success(`sub task deleted successfully`)
    this.allSubTasks = this.allSubTasks.filter((item) => item.id !== taskId);
  
  console.log(this.allSubTasks);
  }
 }); 
 }
 
 public markSubTaskAsDone = (taskId)=>{
  let data = {
    isDone : true,
    id: taskId,
}
this.http.mark_unmark_SubTask(data).subscribe((response) => {

  if(response.error==true){
    this.toastr.error(`Error: ${response.message}`,'', { timeOut: 1000 })
  }else{
    let index = this.allSubTasks.findIndex((obj => obj.id == taskId));
    this.allSubTasks[index].isDone = true;
    this.toastr.success(`task complete`)
  console.log(this.allSubTasks);
  }

  

}); 
 }

 public markSubTaskAsIncomplete = (taskId)=>{
  let data = {
    isDone : false,
    id: taskId,
}
this.http.mark_unmark_SubTask(data).subscribe((response) => {

  if(response.error==true){
    this.toastr.error(`Error: ${response.message}`,'', { timeOut: 1000 })
  }else{
    let index = this.allSubTasks.findIndex((obj => obj.id == taskId));
    this.allSubTasks[index].isDone = false;
    this.toastr.success(`task incomplete`)
  console.log(this.allSubTasks);
  }

  

}); 
 }

 public goToBackPage = ()=>{
   this.location.back();
 }
}
