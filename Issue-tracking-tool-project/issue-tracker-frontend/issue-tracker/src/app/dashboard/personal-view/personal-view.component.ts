import { Component, OnInit,ViewChild,ElementRef,ChangeDetectorRef } from '@angular/core';
import { HttpService } from '../../http.service';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Router } from '@angular/router';
import { SocketService } from '../../socket.service';


declare var $;
@Component({
  selector: 'app-personal-view',
  templateUrl: './personal-view.component.html',
  styleUrls: ['./personal-view.component.css']
})
export class PersonalViewComponent implements OnInit {
 public data = []
 public notifications=[]
 public searchText='';
 public token;
 public userId;
 public userName;
 public anyNotification=false;

 

  constructor(public http:HttpService,public toastr:ToastrService,public router:Router,public socket:SocketService,
    public chRef: ChangeDetectorRef) { }
@ViewChild('dataTable') table;
dataTable:any
  ngOnInit() {
    this.checkStatus();
    this.data = [];
    this.userId = Cookie.get('userId') // userId of user who logged in
    this.token = Cookie.get('authToken');
    this.userName = Cookie.get('userName'); //login
    this.socket.setUser(this.userId)
    this.getAllAssignedIssues();
    this.getRealTimeNotifications();
    this.getAllNotificationForUser();
    this.newIssueAssignedRealTime();
    this.commentNotification();
   
     
  }

  

  public checkStatus: any = () => {

    if (Cookie.get('authToken') === undefined || Cookie.get('authToken') === '' || Cookie.get('authToken') === null) {

      this.router.navigate(['/']);

      return false;

    } else {

      return true;

    }

  }

  public getAllNotificationForUser = ()=>{
    this.http.getAllNotifications(this.userId,this.token).subscribe((response)=>{
      if(response.status==200){
         let data =response.data;
         //console.log(data)
         for(let x in data){
           let obj = {
             text:data[x].text,
             issueId:data[x].issueId
           }
           if(data[x].isSeen==false){
              this.anyNotification=true
           }
           this.notifications.push(obj)
         }
      }else{

      }
    })
  }

 public getAllAssignedIssues(){
  this.http.getAssignedIssues(this.userId,this.token).subscribe((response)=>{
    if(response.status==200){
      console.log(response.data)
        for(let x in response.data){
          let obj = {
            id:response.data[x].id,
            title:response.data[x].title,
            reporter:response.data[x].reporter,
            date:this.getDateFromEpoch(response.data[x].createdOn),
            status:response.data[x].status,
          }
          this.data.push(obj)
        }
        this.chRef.detectChanges();
        this.dataTable = $(this.table.nativeElement);
        this.dataTable.DataTable();
    }else{
      this.toastr.error(response.message)
    }
  })
 }
  public getDateFromEpoch = (ts) => {
    let myDate = new Date(ts * 1000)

    return myDate;
  }
  public showDetails(id){
    this.router.navigate(['/issueDescription',id])
  }

  public searchingIssue(){
    console.log(this.searchText)
    if(!(this.isEmpty(this.searchText))){
      this.http.searchIssue(this.searchText,this.token).subscribe((response)=>{
        if(response.status==200){
          console.log(response.data)
        }else{
          this.toastr.error(response.message)
        }
      })
    }
   
  }
  public isEmpty = (value) => {

    if (value === null || value === undefined || value === '' || value.length === 0) {
      return true
    } else {
      return false
    }
  }

  public logout = () =>{
    this.socket.logoutUser(this.userId);
    this.http.logout(this.token).subscribe((response) => {
      if (response.error) {
        this.toastr.error(response.message)
      } else {
        Cookie.deleteAll();
        this.router.navigate(['/login'])
      }
    })
  } 

  public getRealTimeNotifications=()=>{
    this.socket.anyUpdateOnIssue().subscribe((data)=>{
      console.log(data)
      let temp =data.notification;
      let obj={
        text:temp.text,
        issueId:temp.issueId
      }
      this.notifications.push(obj);
      this.anyNotification=true
    })
  }

  public newIssueAssignedRealTime = ()=>{
    this.socket.newIssueAssigned().subscribe((data)=>{
      
      let temp =data.notification;
      let obj={
        text:temp.text,
        issueId:temp.issueId
      }
      this.notifications.push(obj);
      this.anyNotification=true;

      let temp2 = data.data;
      let obj1 = {
        id:temp2.id,
        title:temp2.title,
        reporter:temp2.reporter,
        date:this.getDateFromEpoch(temp2.createdOn),
        status:temp2.status,
      }
      this.data.unshift(obj1)
    })
  }

  public notificationSeen = ()=>{
    this.anyNotification=false;
    let obj = {
      userId:this.userId,
      isSeen:true
    }
    this.http.markNotificationsSeen(obj,this.token).subscribe((response)=>{
      if(response.status==200){
        console.log("seen")
      }
    })
  }


  public visitIssue = (issueId)=>{
    this.router.navigate(['/issueDescription',issueId])
  }

  public commentNotification= ()=>{
    this.socket.commentOnIssue().subscribe((response)=>{
      let temp =response.notification;
      let obj={
        text:temp.text,
        issueId:temp.issueId
      }
      this.notifications.push(obj);
      this.anyNotification=true
    })
  }
}
