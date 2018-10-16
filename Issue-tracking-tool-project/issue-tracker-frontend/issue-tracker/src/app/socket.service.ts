import { Injectable } from '@angular/core';
import { Observable,Subject,pipe } from 'rxjs';
import * as io from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class SocketService {

  //public baseUrl="http://localhost:3004";
   public baseUrl = "http://issue-tracking-backend.singhmahendra.me"
    private socket;
    constructor() {
      this.socket = io(this.baseUrl);
     }
     public setUser = (userId) => {
      console.log("set user event emit")
       this.socket.emit("register-User", userId);
   
     }
  
     public logoutUser = (userId) => {
      console.log("logout user event emit")
       this.socket.emit("logout-User", userId);
   
     }

     public anyUpdateOnIssue = () => {

      return Observable.create((observer) => {
  
        this.socket.on("New-Notification-update", (userList) => {
         console.log("listening to New-Notification+update event")
         console.log(userList)
          observer.next(userList);
  
        }); // end Socket
  
      }); // end Observable
  
    } 

   

    public newIssueAssigned = () => {

      return Observable.create((observer) => {
  
        this.socket.on("New-Notification-New-isuue", (userList) => {
         console.log("listening to  New-Notification-New-isuue event")
         console.log(userList)
          observer.next(userList);
  
        }); // end Socket
  
      }); // end Observable
  
    } 

    public commentOnIssue = () => {

      return Observable.create((observer) => {
  
        this.socket.on("New-Notification-Comment", (userList) => {
         console.log("listening to New-Notification-Comment event")
         console.log(userList)
          observer.next(userList);
  
        }); // end Socket
  
      }); // end Observable
  
    } 
}
