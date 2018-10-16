import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Router } from '@angular/router';
import { SocketService } from '../../socket.service';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../http.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-multi-user',
  templateUrl: './multi-user.component.html',
  styleUrls: ['./multi-user.component.css']
})
export class MultiUserComponent implements OnInit {
  public allTodoLists = [];
  public allFriends = [];
  public anyNotification: boolean = false;
  public newListName: string
  public userId: string
  public currentList: string
  public sharedWithIds;
  public userInfo
  public sharedWithFriends;
  public textNotifications = []
  public pageValue =0;
  constructor(public toastr: ToastrService, public http: HttpService, public socket: SocketService, public router: Router,
                 public location:Location) { }

  ngOnInit() {

    this.userId = Cookie.get('userId');
    this.userInfo = this.http.getUserInfoFromLocalStorage();
    this.socket.setUser(this.userId);
    this.subscribeToGetMultiUserTodoLists();
    this.getAllFriendsOfUser()
    this.newTextNotification();
    this.getAllTextNotification();
    this.getNotificationOfListModified();
  }

  public createNewTodoTList = (event) => {
    if (event.keyCode == 13) {
      this.addNewTodoList();
    }
  }

  public addNewTodoList = () => {
    if (this.newListName) {
      let data = {
        name: this.newListName,
        userId: this.userId
      }
      this.newListName = "";
      this.http.addNewMultiuserTodoList(data).subscribe((response) => {
        if (response.error) {
          this.toastr.error(response.message)
        } else {
          let temp = { 'id': response.data.id, 'name': response.data.listName };

          this.allTodoLists.push(temp);
          this.toastr.success("Empty list added")
        }
      })
    } else {
      this.toastr.warning("List name can't be empty")
    }
  }

  public subscribeToGetMultiUserTodoLists: any = () => {
    console.log("get all multi user todo lists")
    this.http.getAllMultiUserTodoList(this.userId)
      .subscribe((response) => {

        if (response.error == true) {
          this.toastr.warning(response.message, '', { timeOut: 500 })
        } else {
          this.allTodoLists = [];

          for (let x in response.data) {

            let temp = { 'id': response.data[x].id, 'name': response.data[x].listName };

            this.allTodoLists.push(temp);

          }

          console.log(this.allTodoLists);
        }



      });
  }


  public getAllFriendsOfUser = () => {
    this.http.getAllFriendsOfUser(this.userId).subscribe((response) => {
      if (response.error) {
        this.toastr.error(response.message, '', { timeOut: 500 })
      } else {
        this.allFriends = [];
        console.log(response)
        for (let x in response.data) {

          let temp = { 'friendName': response.data[x].friendName, 'friendId': response.data[x].friendId };

          this.allFriends.push(temp);

        }
        console.log(this.allFriends)
      }
    })
  }


  public shareItWithFriends = (listName) => {
    this.currentList = listName
  }

  public shareWithIt = (friendId) => {
    let data = {
      friendId: friendId,
      listName: this.currentList,
      userName: `${this.userInfo.firstName} ${this.userInfo.lastName}`
    }
    this.http.shareListWithFriend(data).subscribe((response) => {
      if (response.error) {
        this.toastr.error(response.message, '', { timeOut: 2000 })
      } else {

        this.toastr.success("shared")
      }
    })
  }

  public friendToListShared = (listName) => {
    this.currentList = listName
    this.http.getAllFriendToListShared(listName).subscribe((response) => {
      if (response.error) {
        this.toastr.error(response.message, '', { timeOut: 500 })
      } else {
        let temp = response.data[0]
        console.log(temp)
        this.sharedWithIds = [];
        this.sharedWithFriends = []
        this.sharedWithIds = temp.sharedWith;
        for (let userId of this.sharedWithIds) {
          let obj = this.allFriends.find(function (obj) { return obj.friendId === userId; });
          //console.log(obj)
          if (obj != undefined) {
            this.sharedWithFriends.push(obj)
          }
        }
      }
    })
  }

  public removeFriendFromSharedList = (id) => {
    let data = {
      friendId: id,
      listName: this.currentList
    }
    console.log(data)
    this.http.removeFriendFromSharedList(data).subscribe((response) => {
      if (response.error) {
        this.toastr.error(response.message, '', { timeOut: 500 })
      } else {
        console.log(response)
        this.toastr.success(response.message, '', { timeOut: 1000 })
        this.sharedWithFriends = this.sharedWithFriends.filter((item) => item.friendId !== id)

      }
    })
  }

  public enterIntoList = (listName) => {
    this.router.navigate(['/multiUserList', listName])
  }
  public logout = () => {
    this.socket.doUserLogOut(this.userId)
    this.router.navigate(['/login'])

  }


  public newTextNotification = () => {
    this.socket.youHaveNewTextNotification().subscribe((response) => {
      console.log(response);

      if (response.result != null) {
        let temp1 = { 'id': response.result.id, 'name': response.result.listName };

        this.allTodoLists.push(temp1);
      }
      this.anyNotification = true;
      let temp = { 'text': response.text }
      this.textNotifications.push(temp);
    })
  }


  public getAllTextNotification = ()=>{
    this.http.getAllTextNotificationForUser(this.userId,this.pageValue*10).subscribe((response)=>{
      console.log(response)
        if(response.error){
          this.toastr.error(response.message)
        }else{
          if(response.data.length ==0){
             this.toastr.warning("No more messages",'', { timeOut: 2000 })
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

  public deleteTodoList = (id)=>{
    let data = {
      id:id,
      userName:`${this.userInfo.firstName} ${this.userInfo.lastName}`
    }
    this.http.deleteMultiUserTodoList(data).subscribe((response)=>{
      if(response.error){
       this.toastr.error(response.message, '', { timeOut: 500 })
      }else{
        this.allTodoLists = this.allTodoLists.filter((item) => item.id !== id)
      }
    })
  }

  public loadprevoiusTextNotifications = ()=>{
    this.pageValue++;
    this.getAllTextNotification();
  }

  public goToBackPage = ()=>{
    this.location.back()
  }

  public getNotificationOfListModified = () => {
    this.socket.newTextNotificationListModified().subscribe((response) => {
      let temp;
      let data = response.result;
      console.log( response)
      
      if (response.add==true) {
        console.log("add task notification")
      
        temp = { 'text': response.text }
      } else if (response.delete==true) {
       
        temp = { 'text': response.text }
      } else if (response.update==true) {
     
        temp = { 'text': response.text }
        
      }else if(response.deleteList==true){
      //  console.log("?????")

      this.allTodoLists = this.allTodoLists.filter((item) => item.name !== response.result)
       temp = { 'text': response.text };
          
      }
      this.anyNotification = true;
        
      this.textNotifications.push(temp);
    })
  }

}
