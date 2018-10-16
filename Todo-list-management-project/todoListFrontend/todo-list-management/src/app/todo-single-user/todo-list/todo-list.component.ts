import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Router } from '@angular/router';
import { SocketService } from '../../socket.service';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../http.service';
import {Location} from '@angular/common';



@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {


  public newListName:string;
   public scrollToTop:boolean=false;
  public allTodoLists:any=[]
  public userId = Cookie.get('userId');
  public allUsers=[];
  public allNotifications=[]; 
  public userInfo;
  public allFriends=[];
  public anyNotification :boolean=false
  public textNotifications=[];
  public pageValue =0;
  constructor(public router:Router,public socket:SocketService, public toastr : ToastrService,public http:HttpService,public location:Location) { }

  ngOnInit() {
    console.log(this.userId)
    this.subscribeToGetTodoLists();
   // this.newNotificationOfAddFriend();
    this.getAllNotificationToUser();
   // this.socket.existingToDOLists(this.userId);
    this.socket.setUser(this.userId);
    this.getAllFriendsOfUser();
   // this.newNotificationOfRequestAccepted();
   this.getAllTextNotification()
   this.getNewTextNotification();
  

    this.userInfo =this.http.getUserInfoFromLocalStorage();
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
 
  // event binder responsed according to key press
  public createNewTodoTList = (event :any)=>{
    if(event.keyCode === 13){
      this.addNewTodoList();
    }
  }

  public addNewTodoList = ()=>{
    if(this.newListName){
    let data = {
        name : this.newListName,
        userId: this.userId
    }
    this.newListName="";
   this.http.addNewTodoList(data).subscribe((response)=>{
     if(response.error){
       this.toastr.error(response.message)
     }else{
      let temp = { 'id': response.data.id, 'name': response.data.listName};

      this.allTodoLists.push(temp); 
      this.toastr.success("Empty list added")
     }
   })
   }else{
  this.toastr.warning("List name can't be empty")
   }
  }

  public subscribeToGetTodoLists :any =()=>{
    console.log("get all todo lists")
    this.http.getAllTodoList(this.userId)
      .subscribe((response) => {

        if(response.error==true){
          this.toastr.warning(response.message,'',{timeOut: 500})
        }else{
          this.allTodoLists= [];

        for (let x in response.data) {

          let temp = { 'id': response.data[x].id, 'name': response.data[x].listName};

          this.allTodoLists.push(temp);          
     
        }
        
        console.log(this.allTodoLists);
        }
      
        

      }); 
  }

  public logout= ()=>{
    this.socket.doUserLogOut(this.userId)
    this.router.navigate(['/login'])
  
  }

  public deleteTodoList = (listId)=>{
    let data = {
      id :listId
    }
    this.http.deleteTodoList(data).subscribe((response)=>{
      if(response.error){
        this.toastr.error(response.message)
      }else{
        this.toastr.success(response.message);
        this.allTodoLists = this.allTodoLists.filter((item) => item.id !== listId);
      }
    })
  }

  public enterIntoList = (listName) =>{
     this.router.navigate(['/list',listName])
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
        this.toastr.error(response.message,'',{timeOut: 500})
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
      this.toastr.error(response.message,'',{timeOut: 500})
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
  public goToBackPage = ()=>{
    this.location.back();
  }
}
