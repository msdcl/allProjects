import { Component, OnInit,ViewChild, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../http.service';

import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketService } from '../../socket.service';
import { Router } from '@angular/router';
declare var $;
@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.css']
})
export class SearchViewComponent implements OnInit {
  public data = [];
  public searchText;
  public token;
  public userId
  constructor(public http:HttpService,public toastr:ToastrService,public socket:SocketService,public router:Router,
    public chRef: ChangeDetectorRef) { }
  @ViewChild('dataTable') table;
  dataTable:any
  ngOnInit() {
    this.data = [];
    this.checkStatus();
   
    this.userId = Cookie.get('userId')
    this.token = Cookie.get('authToken');
    this.socket.setUser(this.userId)
  
    this.dataTable = $(this.table.nativeElement);
    this.dataTable.DataTable();
    
  }

  public checkStatus: any = () => {

    if (Cookie.get('authToken') === undefined || Cookie.get('authToken') === '' || Cookie.get('authToken') === null) {

      this.router.navigate(['/']);

      return false;

    } else {

      return true;

    }

  }

  public searchingIssue(){
    console.log(this.searchText)
    if(!(this.isEmpty(this.searchText))){
      this.http.searchIssue(this.searchText,this.token).subscribe((response)=>{
        if(response.status==200){
         this.data =[];
          let temp = response.data;
          this.dataTable.DataTable().destroy();
          console.log(temp)
          for(let x in temp){
            temp[x].createdOn = this.getDateFromEpoch(temp[x].createdOn)
            let obj = {
              id:temp[x].id,
              title:temp[x].title,
              reporter:temp[x].reporter,
              date:temp[x].createdOn,
              status:temp[x].status
            }
            this.data.push(obj)
          }
        
         // this.data =temp
         this.chRef.detectChanges();
         
         this.dataTable = $(this.table.nativeElement);
          this.dataTable.DataTable();
      
          console.log(this.data)
        }else{
          this.toastr.error(response.message)
        }
      })
    }else{
      this.chRef.detectChanges();
      this.data=[];
     
      this.dataTable.DataTable().destroy();
      this.dataTable = $(this.table.nativeElement);
        this.dataTable.DataTable();
    }
   
  }

  public isEmpty = (value) => {

    if (value === null || value === undefined || value === '' || value.length === 0) {
      return true
    } else {
      return false
    }
  }

  public showDetails(id){
    this.router.navigate(['/issueDescription',id])
  }
  public getDateFromEpoch = (ts) => {
    let myDate = new Date(ts * 1000)

    return myDate;
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
}
