import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Router } from '@angular/router';
import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
    

  public normalUsers = [];
  public token;
  public userId
  constructor(public http:HttpService, public toastr:ToastrService,public router:Router,public socket:SocketService) { }

  ngOnInit() {
    this.checkStatus();
    this.userId = Cookie.get('userId');
    this.socket.setUser(this.userId)
    this.token = Cookie.get('authToken');
    this.getAllNormalUsers();
  }

  public checkStatus: any = () => {

    if (Cookie.get('authToken') === undefined || Cookie.get('authToken') === '' || Cookie.get('authToken') === null) {

      this.router.navigate(['/']);

      return false;

    } else {

      return true;

    }

  }
  
  public getAllNormalUsers = ()=>{
  
    this.http.getNormalUsers(this.token).subscribe((response)=>{
      if(response.error){
       this.toastr.error(response.message);
      }else{
       
        console.log(response)
        for(let user of response.data){
          let temp = {
            userName:user.userName,
            email:user.email,
            userId:user.userId
          }
          this.normalUsers.push(temp)
        }
      }
      
      
    })
  }

  public scheduleMeetings = (userId,email)=>{
    Cookie.set('normalUserEmail',email)
    this.router.navigate(['/userSlots',userId])
  }
  public logout = ()=>{
    this.socket.logoutUser(this.userId);
    this.http.logout(this.token).subscribe((response)=>{
      if(response.error){
        this.toastr.error(response.message)
      }else{
        Cookie.deleteAll();
        this.router.navigate(['/login'])
      }
    })
  }
}
