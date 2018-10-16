import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from '../../socket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { trimTrailingNulls } from '@angular/compiler/src/render3/view/util';
@Component({
  selector: 'app-issue-view',
  templateUrl: './issue-view.component.html',
  styleUrls: ['./issue-view.component.css']
})
export class IssueViewComponent implements OnInit {

  public description;
  public title;
  public assignee;
  public allUsers = [];
  public assigneeId;
  public userId;
  public userName;
  public token;
  public apiResponse
  public issueId = "";
  public issueView = false;
  public issueReporting = true; //someone reporting new issue
  public isReporter = false;   //wheather user is reporter or not
  public otherUser = true;    //user other than reporter
  public allComments = []
  public comment  //comments added by user
  public watcherArray = []// array of all users that follow this issue
  public status = [];
  public issueStatus;
  public assigneeName;
  public selectedFile:File;
  public attachments;
  public originalName; // original name of attached file
  public uploadedFiles: Array<File>=[]
  public notifications = [];
  public anyNotification = false;
  constructor(public http: HttpService, public toastr: ToastrService, public socket: SocketService, public route: ActivatedRoute,public router:Router) { }
  ngOnInit() {
    this.checkStatus();
    this.userId = Cookie.get('userId') // userId of user who logged in
    this.token = Cookie.get('authToken');
    this.userName = Cookie.get('userName'); //login
    this.usersList();
    this.socket.setUser(this.token)
    this.issueId = this.route.snapshot.paramMap.get('id');
    this.status = ['backlog', 'in-progress', 'in-test', 'done']
    if (!(this.isEmpty(this.issueId))) {
      console.log("checking issueId")
      this.issueView = true;
      this.issueReporting = false;
      this.getIssueDetails();
      this.getAllCommentsForIssue();
    }
  }

  public checkStatus: any = () => {

    if (Cookie.get('authToken') === undefined || Cookie.get('authToken') === '' || Cookie.get('authToken') === null) {

      this.router.navigate(['/']);

      return false;

    } else {

      return true;

    }

  }

  public getAllCommentsForIssue() {
    this.http.getAllCommentsOfIssue(this.issueId, this.token).subscribe((response) => {
      if (response.status == 200) {
        let data = response.data;
        for (let x in data) {
          let obj = {
            by: data[x].by,
            date: this.getDateFromEpoch(data[x].date),
            text: data[x].text
          }
          this.allComments.push(obj)
        }
      }
    })
  }

  public addComment(event) {
    if (event.keyCode === 13) {
      (this.comment).trim()
      if (this.isEmpty(this.comment)) {
        this.toastr.warning("empty Comment")
      } else {
        let obj = {}
        if (this.issueView && this.watcherArray.length > 0) {
          obj = {
            issueId: this.issueId,
            comment: this.comment,
            userName: this.userName,
            userId: this.userId,
            issueName: this.title,
            followers: JSON.stringify(this.watcherArray),
            time: this.getEpoch()
          }
        } else {
          obj = {
            issueId: this.issueId,
            comment: this.comment,
            userName: this.userName,
            userId: this.userId,
            issueName: this.title,
            followers: [],
            time: this.getEpoch()
          }
        }
        this.http.addCommentsToIssue(obj, this.token).subscribe((response) => {
          if (response.status == 200) {
            let data = response.data
            let obj = {
              by: data.by,
              date: this.getDateFromEpoch(data.date),
              text: data.text
            }
            this.allComments.push(obj);
            this.comment = ""
          } else {
            this.toastr.error(response.message)
          }
        })
      }
    }

  }
  public getIssueDetails() {
    this.http.getIssueDetails(this.issueId, this.token).subscribe((response) => {
      if (response.status == 200) {
      
        this.title = response.data[0].title;
        this.assignee = response.data[0].assignee;
        this.description = response.data[0].description;
        this.watcherArray = response.data[0].watch;
        this.issueStatus = response.data[0].status
        this.attachments = response.data[0].attachments;
        let temp = this.attachments.split('/')[1];
        this.originalName =temp;
        if (this.userId == response.data[0].reporterId) {
          this.isReporter = true;
          this.otherUser = false
        
        }
      } else {
        this.toastr.error(response.message)
      }
    })
  }
  public usersList() {
    this.http.getAllUsers(this.token).subscribe(
      (response) => {
        console.log(response)

        if (response.status === 200) {
          for (let x in response.data) {
            let obj = {
              id: response.data[x].userId,
              name: response.data[x].userName
            }
            this.allUsers.push(obj)
          }


        } else {
          this.toastr.warning(response.message, 'alert!')
          // alert(apiResponse.message)
          // console.log(apiResponse.message);

        }

      },
      error => {
        this.toastr.error("Some error has been occured", 'alert!')

      }
    );
  }

  public selectChangeHandler(obj) {
    this.assigneeId = obj;
    console.log(obj)
  }
  public selectChangeHandler2(status) {
    this.issueStatus = status
  }

  public onFileSelected(event){
    this.selectedFile= <File>event.target.files[0];
    console.log(this.selectedFile)
   this.uploadedFiles.push(this.selectedFile)
  }

  public reportIssue() {
    if(this.isEmpty(this.title)){
      this.toastr.warning("Title empty")
    }else if(this.isEmpty(this.assignee)){
      this.toastr.warning("choose assignee")
    }else if(this.isEmpty(this.status)){
      this.toastr.warning("choose status")
    }else if(this.isEmpty(this.description)){
      this.toastr.warning("add description")
    }else{
      let obj = this.allUsers.find(o => o.id === this.assigneeId);
    this.assigneeName = obj.name;

    let tempWatcher = [];
    tempWatcher.push({ id: this.assigneeId, name: this.assigneeName });
    if(this.userId!=this.assigneeId){
      tempWatcher.push({ id: this.userId, name: this.userName });
    }
   
    console.log(this.uploadedFiles)
    let data = {
      title: this.title,
      assignee: this.assigneeId,
      description: this.description,
      time: this.getEpoch(),
      status: this.issueStatus,
      watch: JSON.stringify(tempWatcher),
      attachment:this.selectedFile
    }
    this.http.createNewIssue(data, this.token).subscribe((response) => {
      if (response.status === 200) {
        this.toastr.success('Issue reported successfully!')
        this.router.navigate(['/dashboard']);
      } else {
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

  public getEpoch = () => {
    let time = new Date();

    let epoch = Math.round(time.getTime() / 1000);

    return epoch;
  }

  public followIt() {
    let obj = {
      id: this.issueId,
      userId: this.userId,
      name: this.userName
    }
    this.http.followIssue(obj, this.token).subscribe((response) => {
      if (response.status == 200) {
        this.toastr.success("followed !")
      } else {
        this.toastr.warning(response.message + "!")
      }
    })
  }

  public getDateFromEpoch = (ts) => {
    let myDate = new Date(ts * 1000)

    return myDate;
  }

  public updateIssue() {
    let obj = {
      id: this.issueId,
      title: this.title,
      assignee: this.assignee,
      description: this.description,
      status: this.issueStatus,
      attachment:this.selectedFile
    }
    this.http.updateIssue(obj, this.token).subscribe((response) => {
      if (response.status == 200) {
        this.toastr.success("updated")
        this.attachments = response.data.attachments;
        let temp = this.attachments.split('/')[1];
        this.originalName =temp;
      } else {
        this.toastr.warning(response.message)
      }
    })
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
