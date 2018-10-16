import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http'; 
import { HttpModule } from '@angular/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpService } from './http.service';
import { SocketService } from './socket.service';
import { UserModule } from './user/user.module';
import { LoginComponent } from './user/login/login.component';
import {DataTableModule} from "angular-6-datatable";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    UserModule,
    HttpClientModule,
    HttpModule,
    BrowserAnimationsModule,
    DataTableModule,
    ToastrModule.forRoot(),
 
    RouterModule.forRoot([
      {path:'login',component:LoginComponent},
      {path:'', redirectTo :'login',pathMatch:'full'},
      {path:'*',redirectTo :'login',pathMatch:'full'},
      {path:'**', redirectTo :'login',pathMatch:'full'}
    ])
  ],
  providers: [HttpService,SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
