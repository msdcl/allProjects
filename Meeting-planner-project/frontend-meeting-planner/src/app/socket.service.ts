import { Injectable } from '@angular/core';
import { Observable,Subject,pipe } from 'rxjs';
import * as io from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public baseUrl="http://backend-meeting-planner.singhmahendra.me";
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
   public newNotification = () => {

    return Observable.create((observer) => {

      this.socket.on("meeting-info", (data) => {
       console.log("listening to meeting-info")
       
        observer.next(data);

      }); // end Socket

    }); // end Observable

  } 
}
