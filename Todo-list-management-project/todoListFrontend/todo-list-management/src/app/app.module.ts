import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HttpService } from './http.service';
import { UserModule } from './user/user.module';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './user/login/login.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    UserModule,
    HttpClientModule,
    FormsModule,
    UserModule,
    
   BrowserAnimationsModule,
   ToastrModule.forRoot(),
    RouterModule.forRoot([
      {path:'login',component:LoginComponent},
      {path:'', redirectTo :'login',pathMatch:'full'},
      {path:'*',redirectTo :'login',pathMatch:'full'},
      {path:'**', redirectTo :'login',pathMatch:'full'}
    ])
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
