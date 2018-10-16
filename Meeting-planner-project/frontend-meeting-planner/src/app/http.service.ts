import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Headers, RequestOptionsArgs, RequestOptions, RequestMethod} from '@angular/http';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public baseUrl = "http://backend-meeting-planner.singhmahendra.me"
  constructor(public http:HttpClient) { }
  public doSignInFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password)
    return this.http.post(`${this.baseUrl}/api/v1/login`, params);

  }

  public getUserInfoFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  // function to set value in local staorage
  public settUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }

  public doSignUpFunction(data):Observable<any>{
    const params = new HttpParams()
         .set('userName',data.userName)
         .set('email',data.email)
         .set('password',data.password)
         .set('mobileNumber',data.mobileNumber)
         .set('countryCode',data.countryCode)
  return this.http.post(`${this.baseUrl}/api/v1/signup`,params);
     
  }

  public sendForgotPasswordEmail(data):Observable<any>{
    const params = new HttpParams()
         .set('email',data)
  return this.http.post(`${this.baseUrl}/api/v1/forgotPassword`,params);
     
  }

  public updatePassword(data):Observable<any>{
    const params = new HttpParams()
         .set('email',data.email)
         .set('code',data.code)
         .set('password',data.password)
  return this.http.post(`${this.baseUrl}/api/v1/changePassword`,params);
     
  }

  public getNormalUsers(token):Observable<any>{
    
    return this.http.post(`${this.baseUrl}/api/v1/getNormalUsers`,'',{
      headers: new HttpHeaders().set('authToken', token)
  })
  }

  public getAllEventsOfAMonth(data,token):Observable<any>{
    const params = new HttpParams()
    .set('userId',data.userId)
    .set('startTime',data.startTime)
    .set('endTime',data.endTime)
    return this.http.post(`${this.baseUrl}/api/v1/getAllMeetings`,params,{
      headers: new HttpHeaders().set('authToken', token)
  })
  }

  public addNewEvent(data,token):Observable<any>{
    const params = new HttpParams()
    .set('userId',data.userId)
    .set('startTime',data.startTime)
    .set('endTime',data.endTime)
    .set('createdBy',data.createdBy)
    .set('userEmail',data.userEmail)
    .set('description',data.description)
    .set('name',data.name)
    return this.http.post(`${this.baseUrl}/api/v1/addMeeting`,params,{
      headers: new HttpHeaders().set('authToken', token)})
  }

  public deleteThisEvent(data,token):Observable<any>{
    const params = new HttpParams()
    .set('id',data.id)
    .set('userEmail',"m.chauhankkm@gmail.com")
    return this.http.post(`${this.baseUrl}/api/v1/deleteMeeting`,params,{
      headers: new HttpHeaders().set('authToken', token)})
  }

  public editThisEvent(data,token):Observable<any>{
    const params = new HttpParams()
    .set('id',data.id)
    .set('userEmail',data.userEmail)
    .set('startTime',data.startTime)
    .set('endTime',data.endTime)
    .set('description',data.description)
    .set('name',data.name)
    return this.http.post(`${this.baseUrl}/api/v1/updateMeeting`,params,{
      headers: new HttpHeaders().set('authToken', token)})
  }


  public logout(token):Observable<any>{
   
    return this.http.post(`${this.baseUrl}/api/v1/logout`,'',{
      headers: new HttpHeaders().set('authToken', token)})
  }

  public getAllNotifications(data,token):Observable<any>{
    const params = new HttpParams()
    .set('userId',data)
    return this.http.post(`${this.baseUrl}/api/v1/notifications`,params,{
      headers: new HttpHeaders().set('authToken', token)})
  }

  public markNotificationsAsSeen(data,token):Observable<any>{
    const params = new HttpParams()
    .set('userId',data.userId)
    .set('isSeen',data.isSeen)
    return this.http.post(`${this.baseUrl}/api/v1/notificationSeen`,params,{
      headers: new HttpHeaders().set('authToken', token)})
  }

  public snoozeNotification(data,token):Observable<any>{
    const params = new HttpParams()
    .set('id',data.id)
    .set('isSnoozed',data.isSnoozed)
    
    return this.http.post(`${this.baseUrl}/api/v1/updateMeeting`,params,{
      headers: new HttpHeaders().set('authToken', token)})
  }

  public dismissNotification(data,token):Observable<any>{
    const params = new HttpParams()
    .set('id',data.id)
    .set('isDismissed',data.isDismissed)
    
    return this.http.post(`${this.baseUrl}/api/v1/updateMeeting`,params,{
      headers: new HttpHeaders().set('authToken', token)})
  }
}
