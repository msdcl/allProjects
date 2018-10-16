import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from '../../socket.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../http.service';
@Component({
  selector: 'app-list-choice',
  templateUrl: './list-choice.component.html',
  styleUrls: ['./list-choice.component.css']
})
export class ListChoiceComponent implements OnInit {
  
  public userId = Cookie.get('userId');
  public anyNotification:boolean;
  public allFriends = [];
  public allUsers=[];
  public allNotifications=[];
  public userInfo;
  public textNotifications=[];
  public pageValue =0;

  constructor(public socket:SocketService,public router :Router,public toastr:ToastrService,public http:HttpService) { }

  ngOnInit() {
    this.socket.setUser(this.userId);
    this.userInfo =this.http.getUserInfoFromLocalStorage();
    this.getAllNotificationToUser();
   
     this.socket.setUser(this.userId);
     this.getAllFriendsOfUser();
  
    this.getAllTextNotification()
    this.getNewTextNotification();
  }
  public logout= ()=>{
    this.socket.doUserLogOut(this.userId)
    this.router.navigate(['/login'])
  
  }
  public personalLists = ()=>{
    this.router.navigate(['/addTodoList'])
  }

  public sharedLists = ()=>{
    this.router.navigate(['/multiUserLists'])
  }

  public getAllUsers = ()=>{
    this.getAllNotificationToUser();
    this.http.getAllUsersOnPlatform().subscribe((response)=>{
      if(response.error){
        this.toastr.error(response.message)
      }else{
        let tempArr= [];

        for (let x in response.data) {

          let temp = { 'id': response.data[x].userId, 'name': `${response.data[x].firstName} ${response.data[x].lastName}`};

          tempArr.push(temp);          
     
        }
       for(let x in this.allNotifications){
        tempArr = tempArr.filter((item) => item.id !== this.allNotifications[x].toId);
        tempArr = tempArr.filter((item) => item.id !== this.allNotifications[x].byId);
       }
       for(let x in this.allFriends){
        tempArr = tempArr.filter((item) => item.id !== this.allFriends[x].friendId);
       }
       tempArr = tempArr.filter((item) => item.id !== this.userId);
        this.allUsers = tempArr;
        console.log(this.allUsers);
      }
    })
  }

  public addNewFriend = (event,requestedTo,name,i)=>{
    
    console.log(event);
    event.disabled=true;
        let  data = {
          name : name,
          nameBy : `${this.userInfo.firstName} ${this.userInfo.lastName}`,
          receiverId : requestedTo,
          senderId : this.userId
        }
        console.log(data);
        this.http.friendRequestSent(data).subscribe((response)=>{
          if(response.error){
            this.toastr.error(response.message);
          }
          else{
           this.allUsers = this.allUsers.filter((item) => item.id !== requestedTo)
           this.getAllNotificationToUser();
          }
        })
  }

  public acceptFriendRequest = (id,friendName,friendId,i)=>{
    
     let data = {
       id : id,
       userId : this.userId,
       friendId : friendId,
       friendName : friendName,
       userName  :`${this.userInfo.firstName} ${this.userInfo.lastName}`
     }
     console.log(data)
     this.http.acceptFriendRequest(data).subscribe((response)=>{
       if(response.error){
         this.toastr.error(response.message)
       }else{
        this.allNotifications = this.allNotifications.filter((item) => item.id !== id);
        let temp = {'friendId':id,'friendName':friendName}
        this.allFriends.push(temp)
       }
     })

  }
  public deleteFriend = (friendId)=>{
   let data  ={
     friendId : friendId,
     userId: this.userId
   }

   this.http.deleteUserFriend(data).subscribe((response)=>{
    if(response.error){
      this.toastr.error(response.message)
    }else{
     this.allFriends = this.allFriends.filter((item) => item.friendId !== friendId);
    }
  })

  }

  public newNotificationOfAddFriend = ()=>{
      this.socket.youHaveNewNotification().subscribe((response)=>{
       // console.log(response);
        let temp = { 'id': response.data.id,'toId': response.data.requestedTo, 'nameBy': response.data.nameBy,'byId':response.data.requestedBy};
    
        this.allNotifications.push(temp);  
        this.anyNotification=true;

        let temp1 = {'text':`${response.data.nameBy} sent you friend request.`}
        this.textNotifications.push(temp1);
      })
  }

  public getAllNotificationToUser = ()=>{
    this.http.pendingFriendRequests(this.userId).subscribe((response)=>{
      if(response.error){
       // this.toastr.error(response.message,'',{timeOut: 500})
      }else{
        this.allNotifications= [];
         console.log(response)
        for (let x in response.data) {
          //  if(response.data[x].isSeen==false && response.data[x].requestedTo==this.userId){
          //      this.anyNotification=true
          //      let temp1 = {'id':response.data[x].id,'text':`${response.data[x].nameBy} sent you friend request.`}
          //      this.textNotifications.push(temp1);
          //  }
          let temp = { 'id': response.data[x].id,'toId': response.data[x].requestedTo, 'nameBy': response.data[x].nameBy,'byId':response.data[x].requestedBy};

          this.allNotifications.push(temp);          
     
        }
        console.log(this.allNotifications)
      }
})
  }

  public newNotificationOfRequestAccepted = ()=>{
    this.socket.youHaveNewNotificationAcceptRequest().subscribe((response)=>{
     // console.log(response);

      this.anyNotification=true;

      let temp1 = {'text':`${response} accepted your friend request.`}
      this.textNotifications.push(temp1);
    })
}

public getAllFriendsOfUser = ()=>{
  this.http.getAllFriendsOfUser(this.userId).subscribe((response)=>{
    if(response.error){
     // this.toastr.error(response.message,'',{timeOut: 500})
    }else{
      this.allFriends= [];
       console.log(response)
      for (let x in response.data) {

        let temp = { 'friendName': response.data[x].friendName, 'friendId': response.data[x].friendId};

        this.allFriends.push(temp);          
   
      }
      console.log(this.allFriends)
    }
})
}
public updateFriendList = ()=>{
   this.getAllFriendsOfUser();
}

  public updateUserNotifications = ()=>{
   //this.getAllNotificationToUser();
  //  console.log(this.textNotifications)
  //  this.anyNotification = false;
  
  //  this.http.updateUserNotificationList(JSON.stringify(this.textNotifications)).subscribe((response)=>{
  //    if(response.error){
  //       this.toastr.error(response.message)
  //    }
  //  })
  this.updateTextNotifications()
  }

  public goToMultiUserListManagement = ()=>{
      this.router.navigate(['/multiUserLists'])
  }

  public getAllTextNotification = ()=>{
    this.http.getAllTextNotificationForUser(this.userId,this.pageValue*10).subscribe((response)=>{
      console.log(response)
        if(response.error){
          this.toastr.error(response.message,'',{timeOut: 500})
        }else{
          if(response.data.length ==0){
             this.toastr.warning("No more messages",'', { timeOut: 1000 })
          }else{
            for(let x in response.data){
              if(response.data[x].isSeen==false){
                 this.anyNotification =true;
              }
              let temp = { 'text': response.data[x].text }
              this.textNotifications.push(temp);
            }
          }
        }
    })
  }

  public updateTextNotifications = () => {
    this.anyNotification=false
     let data = {
       userId : this.userId,
       isSeen :true
     }
     this.http.updateTextNotificationForUser(data).subscribe((response)=>{
       if(response.error){
        this.toastr.error(response.message, '', { timeOut: 500 })
       }
     })
  }
  public getNewTextNotification = ()=>{
    this.socket.youHaveNewTextNotification().subscribe((response)=>{
      this.anyNotification=true;
      let temp = { 'text': response.text }
              this.textNotifications.push(temp);
    })
  }

  public loadprevoiusTextNotifications =()=>{
    this.pageValue++;
    this.getAllTextNotification();
  }

}
