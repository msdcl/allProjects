import { Injectable } from '@angular/core';

import { Observable,Subject,pipe } from 'rxjs';
import * as io from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class SocketService {


  public baseUrl="http://todolistbackend.singhmahendra.me";
  //public baseUrl="http://localhost:3000";
  private socket;
  constructor() { 
    this.socket = io(this.baseUrl);
  }

  public setUser = (userId) => {
    console.log("set user event emit")
     this.socket.emit("registeredUser", userId);
 
   }
  public allTodoLists = () => {

    return Observable.create((observer) => {

      this.socket.on("existing-todo-lists", (userList) => {
       console.log("listening to existing-todo-lists event")
       console.log(userList)
        observer.next(userList);

      }); // end Socket

    }); // end Observable

  } 

  public createNewList = (data) => {
     console.log("event emit for creating new list")
     this.socket.emit("new-todo-list", data);
 
   }
   public existingToDOLists = (data) => {
    console.log("event emit for getting existing todo list")
    this.socket.emit("alredy-existing-todo-lists", data);

  }

  public todoListDelete = (data)=>{
    this.socket.emit("delete-todo-list",data)
  }

  public addItemToList= (data)=>{
    this.socket.emit("add-item-to-list",data)
  }


  public getAllItemsOfList = () => {

    return Observable.create((observer) => {

      this.socket.on("all-items-of-list", (userList) => {
       console.log("listening toall-items-of-list event")
       console.log(userList)
        observer.next(userList);

      }); // end Socket

    }); // end Observable

  } 

  public alreadyItemsOfList= (data)=>{
    this.socket.emit("alredy-existing-items-of-lists",data)
  }

  public deleteTodoTask = (data)=>{
    this.socket.emit("delete-task-from-todo-list",data)
  }

  public markTaskAsDoneOrNot = (data)=>{
    console.log("emit event for task done or not")
    this.socket.emit("mark-task-as-complete-incomplete",data)
  }

  public addSubtask= (data)=>{
    this.socket.emit("add-subtask-to-list",data)
  }

  public getAllSubtasks = () => {

    return Observable.create((observer) => {

      this.socket.on("all-subtasks-of-list", (userList) => {
       console.log("listening all-subtasks-of-list event")
       console.log(userList)
        observer.next(userList);

      }); // end Socket

    }); // end Observable

  } 

  public addNewTaskToList = () => {

    return Observable.create((observer) => {

      this.socket.on("newTaskCreated", (userList) => {
       console.log("listening newTaskCreated event")
       console.log(userList)
        observer.next(userList);

      }); // end Socket

    }); // end Observable

  } 


  public youHaveNewNotification = () => {

    return Observable.create((observer) => {

      this.socket.on("youHaveNewNotification-AddFriend", (data) => {
       console.log("listening youHaveNewNotification event")
       console.log(data)
        observer.next(data);

      }); // end Socket

    }); // end Observable

  } 

  public youHaveNewNotificationAcceptRequest = () => {

    return Observable.create((observer) => {

      this.socket.on("youHaveNewNotification-requestAccepted", (data) => {
       console.log("listening youHaveNewNotification event")
       console.log(data)
        observer.next(data);

      }); // end Socket

    }); // end Observable

  } 

  public doUserLogOut= (data)=>{
    this.socket.emit("do-user-log-out",data)
  }

  public youHaveNewTextNotification = () => {

    return Observable.create((observer) => {

      this.socket.on("you-have-text-notification", (data) => {
       console.log("listening you-have-text-notification event")
       console.log(data)
        observer.next(data);

      }); // end Socket

    }); // end Observable

  } 

  public newTextNotificationListModified = () => {

    return Observable.create((observer) => {

      this.socket.on("you-have-text-notification-list-modified", (data) => {
       console.log("listening you-have-text-notification-list-modified event")
       
        observer.next(data);

      }); // end Socket

    }); // end Observable

  } 
}
