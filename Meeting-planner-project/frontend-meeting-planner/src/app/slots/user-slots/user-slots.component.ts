import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import {
 
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../http.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../socket.service';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-user-slots',
  templateUrl: './user-slots.component.html',
  styleUrls: ['./user-slots.component.css']
})
export class UserSlotsComponent implements OnInit {
  public currentEventId; // id of event on which user clicked
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: string = 'month';

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
       
      //  delete event.actions
      this.currentEventId = event.id
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
      //  this.events = this.events.filter(iEvent => iEvent !== event);
      this.currentEventId = event.id
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

 

  activeDayIsOpen: boolean = true;
  public userId;
  public allEvents = [];
  public token;
  public startTime
  public endTime
  public description
  public eventName
  public userName
  public userEmail
  public loginUserId
  public isAdmin
  public notifications = []
  public anyNotification:boolean=false
  public isReminder:boolean=false;
  constructor(public modal: NgbModal,public route: ActivatedRoute,public router:Router, public http:HttpService,
   public toastr:ToastrService,public socket:SocketService) { }
  
  ngOnInit() {
    this.checkStatus();
    this.loginUserId = Cookie.get('userId') // userId of user who logged in
    this.socket.setUser(this.loginUserId)
    this.userId = this.route.snapshot.paramMap.get('userId'); //particluar normal user
    this.token=Cookie.get('authToken');
    this.getAllEventsOfThisMonth(new Date());
    this.userName = Cookie.get('userName'); //login
    this.userEmail = Cookie.get('normalUserEmail') // email of normal user
    this.isAdmin = Cookie.get('isAdmin'); 
    this.getAllTextNotifications()
    this.getNotifications()
  }
 
  public checkStatus: any = () => {

    if (Cookie.get('authToken') === undefined || Cookie.get('authToken') === '' || Cookie.get('authToken') === null) {

      this.router.navigate(['/']);

      return false;

    } else {

      return true;

    }

  }
 public getAllEventsOfThisMonth = (date)=>{
  let  y = date.getFullYear(), m = date.getMonth();
  let firstDay = new Date(y, m, 1);
  let lastDay = new Date(y, m + 2, 0);
  let monthStart = this.getEpoch(firstDay);
  let monthEnd = this.getEpoch(lastDay);
  let data = {
    userId:this.userId,
    startTime:monthStart,
    endTime:monthEnd
  }
 
  this.http.getAllEventsOfAMonth(data,this.token).subscribe((response)=>{
     if(response.error){
        this.toastr.error(response.message)
     }else{
       this.allEvents = [];
      // console.log(response.data);
      for(let event of response.data){
       
        let  start:Date=this.getDateFromEpoch( event.startTime)
        let  end:Date=this.getDateFromEpoch(event.endTime)
         // actions: this.actions,
         // color:colors.blue
         let temp1
        if(this.isAdmin=='true'){
        temp1 = {
          id:event.id,
          title: event.name,
            start: start,
            end: end,
            color: colors.yellow,
            description:event.description,
            draggable: false,
            resizable: {
              beforeStart: true,
              afterEnd: true
            },
            actions: this.actions
        }
      }else{
        temp1 = {
          id:event.id,
          title: event.name,
            start: start,
            end: end,
            color: colors.yellow,
            description:event.description,
            draggable: false,
            resizable: {
              beforeStart: true,
              afterEnd: true
            }
        }
      }
        this.allEvents.push(temp1)
      }
    this.events =this.allEvents;
    this.refresh.next();
     }
  
  })
 }

 public getDateFromEpoch =(ts)=>{
   let myDate = new Date(ts*1000)
 
   return myDate;
 }
  events: CalendarEvent[] = this.allEvents
  //   {
  //     start: subDays(startOfDay(new Date()), 1),
  //     end: addDays(new Date(), 1),
  //     title: 'A 3 day event',
  //     color: colors.red,
  //     actions: this.actions
  //   },
  //   {
  //     start: startOfDay(new Date()),
  //     title: 'An event with no end date',
  //     color: colors.yellow,
  //     actions: this.actions
  //   },
  //   {
  //     start: subDays(endOfMonth(new Date()), 3),
  //     end: addDays(endOfMonth(new Date()), 3),
  //     title: 'A long event that spans 2 months',
  //     color: colors.blue
  //   },
  //   {
  //     start: addHours(startOfDay(new Date()), 2),
  //     end: new Date(),
  //     title: 'A draggable and resizable event',
  //     color: colors.yellow,
  //     actions: this.actions,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true
  //     },
  //     draggable: true
  //   }
  // ];
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    delete event.color
    delete event.draggable
    delete event.resizable
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    // this.events.push({
    //   title: 'New event',
    //   start: startOfDay(new Date()),
    //   end: endOfDay(new Date()),
    //   color: colors.red,
    //   draggable: true,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true
    //   }
    // });
    // this.refresh.next();
  }

  public addNewEvent = ()=>{
    if(!this.eventName){
      this.toastr.warning("Please enter event name")
    }else if(!this.startTime){
      this.toastr.warning("Please enter end time")
    }else if(!this.endTime){
      this.toastr.warning("Please enter start time")
    }else if(!this.description){
      this.toastr.warning("Please add description")
    }else if(this.startTime>this.endTime){
      this.toastr.warning("End time is smaller")
    }else{
      let data = {
        name:this.eventName,
        startTime:this.getEpoch(this.startTime),
        endTime:this.getEpoch(this.endTime),
        description:this.description,
        createdBy:this.userName,
        userEmail:this.userEmail,
        userId:this.userId
      }

      this.http.addNewEvent(data,this.token).subscribe((response)=>{
        if(response.error){
          this.toastr.error(response.message)
        }else{
          this.toastr.success(response.message)
          let data = response.data;
          let temp  ={
            id:data.id,
            title: data.name,
            start: this.getDateFromEpoch(data.startTime),
            end: this.getDateFromEpoch(data.endTime),
            color: colors.red,
            description: data.description,
            draggable: false,
            resizable: {
              beforeStart: true,
              afterEnd: true
            },
            actions: this.actions
          }
          this.events.push(temp);
          this.refresh.next();
        }
      })
    

  }
  }

  public deleteEvent = ()=>{
    let data = {
      id:this.currentEventId,
      userEmail:this.userEmail
    }
    this.http.deleteThisEvent(data,this.token).subscribe((response)=>{
      if(response.error){
        this.toastr.error(response.message)
      }else{
        this.toastr.success("Deletion successful");
        this.events = this.events.filter(iEvent => iEvent.id !== this.currentEventId);
      }
    })
  }

  public EditEvent =()=>{
   
    let data = {
      name:this.eventName,
      startTime:this.startTime,
      endTime:this.endTime,
      description:this.description,
      id:this.currentEventId,
      userEmail:this.userEmail
    }
    
    this.http.editThisEvent(data,this.token).subscribe((response)=>{
      if(response.error){
        this.toastr.error(response.message)
      }else{
       data= response.data;
       console.log(response.data)
        this.toastr.success("Event edited");
        this.events = this.events.filter(iEvent => iEvent.id !== this.currentEventId);
        let temp ={
          id:data.id,
          title: data.name,
          start: this.getDateFromEpoch(data.startTime),
          end: this.getDateFromEpoch(data.endTime),
          color: colors.blue,
          description: data.description,
          draggable: false,
          resizable: {
            beforeStart: true,
            afterEnd: true
          },
          actions: this.actions
        }
        this.events.push(temp);
        this.refresh.next();
      }
    })
  }
  public isEmpty = (value) => {
    if (value === null || value === undefined || value.trim() === '' || value.length === 0) {
      return true
    } else {
      return false
    }
  }

  public getEpoch = (time)=>{
    //var currentDate = new Date();
  
  //  var currentTime = time.getTime();
    
   // var localOffset = (-1) * currentDate.getTimezoneOffset() * 60000;
    let epoch =Math.round(time.getTime()/1000);
    
    return epoch;
   }

   public thisMonthEvents = ()=>{

    let date = this.viewDate;
   this.getAllEventsOfThisMonth(date);
   }

   public logout = ()=>{
     this.socket.logoutUser(this.loginUserId);
     this.http.logout(this.token).subscribe((response)=>{
       if(response.error){
         this.toastr.error(response.message)
       }else{
         Cookie.deleteAll();
         this.router.navigate(['/login'])
       }
     })
   }

   public getNotifications = ()=>{
     this.socket.newNotification().subscribe((response)=>{
       let data = response.meetingInfo
       this.isReminder=false;
       console.log(data)
       if(response.add ==true){

        let temp  ={
          id:data.id,
          title: data.name,
          start: this.getDateFromEpoch(data.startTime),
          end: this.getDateFromEpoch(data.endTime),
          color: colors.red,
          description: data.description,
          draggable: false,
          resizable: {
            beforeStart: true,
            afterEnd: true
          }
        }
        this.events.push(temp);
        this.refresh.next();
        let temp1 ={
          text:response.text,
          id:''
        }
        this.notifications.push(temp1)

       }else if(response.update==true){

        this.events = this.events.filter(iEvent => iEvent.id !== data.id);
        let temp ={
          id:data.id,
          title: data.name,
          start: this.getDateFromEpoch(data.startTime),
          end: this.getDateFromEpoch(data.endTime),
          color: colors.blue,
          description: data.description,
          draggable: false,
          resizable: {
            beforeStart: true,
            afterEnd: true
          }
        }
        this.events.push(temp);
        this.refresh.next();
        let temp1 ={
          text:response.text,
          id:''
        }
        this.notifications.push(temp1)

       }else if(response.delete==true){

       }else if(response.reminder==true){
        let temp1 ={
          text:response.text,
          id:data.id
        }
        this.notifications.push(temp1)
        this.isReminder=true;
       }
       this.anyNotification = true;
     })
   }

   public getAllTextNotifications = ()=>{
     this.http.getAllNotifications(this.userId,this.token).subscribe((response)=>{
         if(response.error){
           this.toastr.error(response.message)
         }else{
          for(let message of response.data){
            let temp = {
              text:message.text
            }
            if(message.isSeen==false){
              this.anyNotification =true
            }
           
            this.notifications.push(temp);
          }
         }
     })
   }

   public notificationSeen = ()=>{
     this.anyNotification = false;
     let data = {
       userId:this.userId,
       isSeen:true
     }
     this.http.markNotificationsAsSeen(data,this.token).subscribe((response)=>{
       if(response.error){
         this.toastr.error(response.message);
       }
     })
   }


   public snoozeIt = (id)=>{
     let data = {
       id:id,
       isSnoozed:true
     }
     this.http.snoozeNotification(data,this.token).subscribe((response)=>{
       if(response.error){
         this.toastr.error(response.message)
       }
     })
   }
   public dismissIt = (id)=>{
    let data = {
      id:id,
      isDismissed:true
    }
    this.http.dismissNotification(data,this.token).subscribe((response)=>{
      if(response.error){
        this.toastr.error(response.message)
      }
    })
   }
}
