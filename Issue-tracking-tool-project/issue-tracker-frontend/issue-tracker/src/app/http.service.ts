import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
 // public baseUrl = "http://localhost:3004"
  public baseUrl = "http://issue-tracking-backend.singhmahendra.me"
  constructor(public http: HttpClient) { }

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

  public doSignUpFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('userName', data.userName)
      .set('email', data.email)
      .set('password', data.password)
      .set('mobileNumber', data.mobileNumber)
    return this.http.post(`${this.baseUrl}/api/v1/signup`, params);

  }

  public sendForgotPasswordEmail(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data)
    return this.http.post(`${this.baseUrl}/api/v1/forgotPassword`, params);

  }

  public updatePassword(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
      .set('code', data.code)
      .set('password', data.password)
    return this.http.post(`${this.baseUrl}/api/v1/changePassword`, params);

  }
  public getAllUsers(token): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/v1/allUsers`, '');
  }

  public createNewIssue(data, token): Observable<any> {
    var fd = new FormData();
    fd.append('title', data.title)
    fd.append('assignee', data.assignee)
    fd.append('description', data.description)
    fd.append('time', data.time)
    fd.append('status', data.status)
    fd.append('watch', data.watch)
    fd.append('attachment', data.attachment)
    
    
  console.log(fd)
    // const params = new HttpParams()
    // .set('title',data.title)
    // .set('assignee',data.assignee)
    // .set('description',data.description)
    // .set('time',data.time)
    // .set('status',data.status)
    // .set('watch',data.watch)
    // .set('attachment',data.attachment)
    return this.http.post(`${this.baseUrl}/api/v1/reportIssue`, fd, {
      headers: new HttpHeaders().set('authToken', token)
    })
  }

  public getAssignedIssues(data, token): Observable<any> {
    const params = new HttpParams()
      .set('userId', data)
    return this.http.post(`${this.baseUrl}/api/v1/assignedIssuesToUser`, params, {
      headers: new HttpHeaders().set('authToken', token)
    })
  }

  public getIssueDetails(data, token): Observable<any> {
    const params = new HttpParams()
      .set('id', data)
    return this.http.post(`${this.baseUrl}/api/v1/getIssueDetails`, params, {
      headers: new HttpHeaders().set('authToken', token)
    })
  }

  public followIssue(data, token): Observable<any> {
    const params = new HttpParams()
      .set('id', data.id)
      .set('watcherId', data.userId)
      .set('watcherName', data.name)
    return this.http.post(`${this.baseUrl}/api/v1/followIssue`, params, {
      headers: new HttpHeaders().set('authToken', token)
    })
  }

  public getAllCommentsOfIssue(data, token): Observable<any> {
    const params = new HttpParams()
      .set('issueId', data)
    return this.http.post(`${this.baseUrl}/api/v1/allCommentsForIssue`, params, {
      headers: new HttpHeaders().set('authToken', token)
    })
  }

  public addCommentsToIssue(data, token): Observable<any> {
    const params = new HttpParams()
      .set('issueId', data.issueId)
      .set('text', data.comment)
      .set('name', data.userName)
      .set('userId', data.userId)
      .set('watcher', data.followers)
      .set('issueName', data.issueName)
      .set('time', data.time)
    return this.http.post(`${this.baseUrl}/api/v1/addCommentsToIssue`, params, {
      headers: new HttpHeaders().set('authToken', token)
    })
  }


  public updateIssue(data, token): Observable<any> {

    var fd = new FormData();
    fd.append('id', data.id)
    fd.append('title', data.title)
    fd.append('assignee', data.assignee)
    fd.append('description', data.description)
    fd.append('status', data.status)
    fd.append('attachment', data.attachment)
    // const params = new HttpParams()
    //   .set('id', data.id)
    //   .set('title', data.title)
    //   .set('assignee', data.assignee)
    //   .set('description', data.description)
    //   .set('status', data.status)
    return this.http.post(`${this.baseUrl}/api/v1/updateIssue`, fd, {
      headers: new HttpHeaders().set('authToken', token)
    })
  }

  public searchIssue(data, token): Observable<any> {
    const params = new HttpParams()
      .set('text', data)
    return this.http.post(`${this.baseUrl}/api/v1/searchIssue`, params, {
      headers: new HttpHeaders().set('authToken', token)
    })
  }
  public logout(token): Observable<any> {

    return this.http.post(`${this.baseUrl}/api/v1/logout`, '', {
      headers: new HttpHeaders().set('authToken', token)
    })
  }

  public getAllNotifications(data, token): Observable<any> {
    const params = new HttpParams()
      .set('userId', data)
    return this.http.post(`${this.baseUrl}/api/v1/getAllNotifications`, params, {
      headers: new HttpHeaders().set('authToken', token)
    });

  }

  public markNotificationsSeen(data, token): Observable<any> {
    const params = new HttpParams()
      .set('userId', data.userId)
      .set('isSeen', data.isSeen)
    return this.http.post(`${this.baseUrl}/api/v1/markNotificationSeen`, params, {
      headers: new HttpHeaders().set('authToken', token)
    });

  }

  public unfollowIssue(data, token): Observable<any> {
    const params = new HttpParams()
      .set('userId', data.userId)
      .set('issueId', data.issueId)
    return this.http.post(`${this.baseUrl}/api/v1/unfollowIssue`, params, {
      headers: new HttpHeaders().set('authToken', token)
    })
  }
}
