import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from '../../socket.service';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../http.service';

@Component({
  selector: 'app-add-task-list',
  templateUrl: './add-task-list.component.html',
  styleUrls: ['./add-task-list.component.css']
})
export class AddTaskListComponent implements OnInit {

  public currentListName: string;
  public itemName: string;
  public userId;
  public userInfo
  public allTasks = []
  public anyNotification: boolean = false
  public textNotifications = []
  public sharedWith = []
  public currTaskId;
  public editedName
  public oldName
  public scrollToTop:boolean=false
  public pageValue=0
  constructor(public activatedRoute: ActivatedRoute, public location: Location, public router: Router,
    public socket: SocketService, public toastr: ToastrService, public http: HttpService) {

  }

  ngOnInit() {
    this.currentListName = this.activatedRoute.snapshot.paramMap.get('listName');
    this.userId = Cookie.get('userId');
    this.userInfo = this.http.getUserInfoFromLocalStorage();
    this.socket.setUser(this.userId);
    this.getAllTasksOfMultiUserList()
    this.getAllTextNotification();
    this.friendToListShared();
    this.getNotificationOfListModified()
  }


  public addNewItemToList = (event) => {
    if (event.keyCode == 13) {
      this.addNewTask()
    }
  }

  public addNewTask = () => {
    if (this.itemName) {


      let data = {
        currList: this.currentListName,
        newTask: this.itemName,
        userId: this.userId,
        userName: `${this.userInfo.firstName} ${this.userInfo.lastName}`
      }
      this.itemName = ""
      this.http.addNewTaskToMultiUserList(data).subscribe((response) => {
        if (response.error) {
          this.toastr.warning(`Error: ${response.message}`)
        } else {
          console.log(response)
          let temp = { 'isDone': response.data.isDone, 'taskName': response.data.taskName, 'id': response.data.id };

          this.allTasks.push(temp);
        }
      });

      // this.socket.addItemToList(data);
    } else {
      this.toastr.warning("item can't be empty")
    }
  }

  public getAllTasksOfMultiUserList = () => {

    this.http.getTasksOfMultiUserList(this.currentListName).subscribe((response) => {
      if (response.error == true) {
        this.toastr.warning(response.message, '', { timeOut: 500 })
      } else {
        console.log(response)
        this.allTasks = [];

        for (let x in response.data) {

          let temp = { 'id': response.data[x].id, 'taskName': response.data[x].taskName, 'isDone': response.data[x].isDone };

          this.allTasks.push(temp);

        }

        console.log(this.allTasks);
      }
    })
  }

  public deleteTaskFromList = (id, taskName) => {
    let data = {
      id: id,
      taskName: taskName,
      listName: this.currentListName,
      userId: this.userId,
      userName: `${this.userInfo.firstName} ${this.userInfo.lastName}`,
      sharedWith: JSON.stringify(this.sharedWith)
    }
    this.http.deleteTasksOfMultiUserList(data).subscribe((response) => {
      console.log(response)
      if (response.error) {
        this.toastr.error(response.message)
      } else {
        this.allTasks = this.allTasks.filter((item) => item.id !== id);
      }
    })
  }

  public getNotificationOfListModified = () => {
    this.socket.newTextNotificationListModified().subscribe((response) => {
     
      let data = response.result;
      console.log( response)
      let temp;
      if (response.add==true) {
        console.log("add task notification")
        let temp1 = { 'id': data.id, 'taskName': data.taskName, 'isDone': data.isDone };

        this.allTasks.push(temp1);
        temp = { 'text': response.text }
      } else if (response.delete==true) {
        console.log("delete task notification")
        this.allTasks = this.allTasks.filter((item) => item.id !== response.result);
        temp = { 'text': response.text }
      } else if (response.update==true) {
     
        temp = { 'text': response.text }
        if (data.type === "editName") {
          let index = this.allTasks.findIndex((obj => obj.id == data.id));
          this.allTasks[index].taskName = data.taskName
        } else if (data.type === "check") {
         
          if (data.isDone=="true") {
           
            let index = this.allTasks.findIndex((obj => obj.id == data.id));
            this.allTasks[index].isDone = true
          } else {
           
            let index = this.allTasks.findIndex((obj => obj.id == data.id));
            this.allTasks[index].isDone = false
          }
        }
      }
      else if(response.deleteList==true){
        console.log("?????")
        temp = { 'text': response.text };
        if(this.currentListName==response.result){
          this.location.back();
        }
      }
      this.anyNotification = true;

      this.textNotifications.push(temp);
    })
  }

  public getAllTextNotification = () => {
    this.http.getAllTextNotificationForUser(this.userId,this.pageValue*10).subscribe((response) => {
      console.log(response)
      if (response.error) {
        this.toastr.error(response.message)
      } else {
        for (let x in response.data) {
          if (response.data[x].isSeen == false) {
            this.anyNotification = true;
          }
          let temp = { 'text': response.data[x].text }
          this.textNotifications.push(temp);
        }
      }
    })
  }

  public updateTextNotifications = () => {
    this.anyNotification = false
    let data = {
      userId: this.userId,
      isSeen: true
    }
    this.http.updateTextNotificationForUser(data).subscribe((response) => {
      if (response.error) {
        this.toastr.error(response.message, '', { timeOut: 500 })
      }
    })
  }

  public goToBackPage = () => {
    this.location.back();
  }

  public logout = () => {
    this.socket.doUserLogOut(this.userId)
    this.router.navigate(['/login'])

  }

  public friendToListShared = () => {

    this.http.getAllFriendToListShared(this.currentListName).subscribe((response) => {
      if (response.error) {
        this.toastr.error(response.message, '', { timeOut: 500 })
      } else {
        let temp = response.data[0]
        console.log(temp)
        this.sharedWith = temp.sharedWith;

      }
    })
  }


  public markAsDone = (taskId, name) => {

    let data = {
      taskName: name,
      id: taskId,
      userName: `${this.userInfo.firstName} ${this.userInfo.lastName}`,
      listName: this.currentListName,
      sharedWith: JSON.stringify(this.sharedWith),
      userId: this.userId,
      type: "check",
      isDone: true
    }

    this.http.markTaskOfMultiUserList(data).subscribe((response) => {

      if (response.error == true) {
        this.toastr.error(`Error: ${response.message}`)
      } else {
        let index = this.allTasks.findIndex((obj => obj.id == taskId));
        this.allTasks[index].isDone = true;
        this.toastr.success(`task is complete`)
        console.log(this.allTasks);
      }



    });
  }

  public markAsIncomplete = (taskId, name) => {
    let data = {
      taskName: name,
      id: taskId,
      userName: `${this.userInfo.firstName} ${this.userInfo.lastName}`,
      listName: this.currentListName,
      sharedWith: JSON.stringify(this.sharedWith),
      userId: this.userId,
      type: "check",
      isDone: false
    }
    this.http.markTaskOfMultiUserList(data).subscribe((response) => {

      if (response.error == true) {
        this.toastr.error(`Error: ${response.message}`)
      } else {
        let index = this.allTasks.findIndex((obj => obj.id == taskId));
        this.allTasks[index].isDone = false;
        this.toastr.success(`task is incomplete`)
        console.log(this.allTasks);
      }



    });
  }

  public editThisTask = (taskId, name) => {
    this.currTaskId = taskId
    this.oldName = name
  }

  public editTaskName = () => {
    let data = {
      oldName: this.oldName,
      taskName: this.editedName,
      id: this.currTaskId,
      userName: `${this.userInfo.firstName} ${this.userInfo.lastName}`,
      listName: this.currentListName,
      sharedWith: JSON.stringify(this.sharedWith),
      userId: this.userId,
      type: "editName"
    }
    this.http.editTaskOfMultiUserList(data).subscribe((response) => {

      if (response.error == true) {
        this.toastr.error(`Error: ${response.message}`)
      } else {
        let index = this.allTasks.findIndex((obj => obj.id == this.currTaskId));
        this.allTasks[index].taskName = this.editedName
        this.toastr.success(`task name edited`)
        console.log(this.allTasks);
      }



    });
  }

  public loadprevoiusTextNotifications = ()=>{
    this.pageValue++;
    this.getAllTextNotification();
  }

}
