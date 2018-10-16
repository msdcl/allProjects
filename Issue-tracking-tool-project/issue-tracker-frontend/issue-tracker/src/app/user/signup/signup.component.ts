import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpService } from '../../http.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public userName;
  public email;
  public password;
  public mobileNumber;
  constructor(public router:Router,public toastr:ToastrService,public http:HttpService) { }

  ngOnInit() {
  }
  public doSignUp() {
    this.userName =this.userName.trim();
    this.email =this.email.trim();
    this.mobileNumber =this.mobileNumber.trim();
    if (!this.userName) {
      this.toastr.warning('Enter user name', 'Alert!');
    } else if (!this.email) {
      this.toastr.warning('Enter your email', 'Alert!');
    } else if (!this.password) {
      this.toastr.warning('Enter your password', 'Alert!');
    } else if (!this.mobileNumber) {
      this.toastr.warning('Enter mobile number ', 'Alert!');
    } else {
      let data = {
        userName: this.userName,
        email: this.email,
        password: this.password,
        mobileNumber: this.mobileNumber,
      }

      this.http.doSignUpFunction(data).subscribe(
        (apiResponse) => {
          console.log(apiResponse)

          if (apiResponse.status === 200) {
            this.toastr.success("sign up successful", 'success!')
            this.router.navigate(['/login']);



          } else {
            this.toastr.warning(apiResponse.message, 'alert!')
            // alert(apiResponse.message)
            console.log(apiResponse.message);

          }

        },
        error => {
          this.toastr.error("Some error has been occured", 'alert!')

        }
      );
    }
  }
}
