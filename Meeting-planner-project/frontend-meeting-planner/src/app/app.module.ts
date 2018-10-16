import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './user/login/login.component';
import { HttpService } from './http.service';
import { SocketService } from './socket.service';
import { UserModule } from './user/user.module';
import { HttpClientModule } from '@angular/common/http'; 
import { HttpModule } from '@angular/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OnlyNumberDirective } from './only-number.directive';

 
@NgModule({
  declarations: [
    AppComponent,
    OnlyNumberDirective
  ],
  imports: [
    BrowserModule,
    UserModule,
    HttpClientModule,
    HttpModule,
    BrowserAnimationsModule,
    
  
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
