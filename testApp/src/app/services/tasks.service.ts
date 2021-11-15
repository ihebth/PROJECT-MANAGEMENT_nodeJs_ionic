import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

export interface Task {
  name: string,
  priority: string,
  desc: string,
  color: string,
  due_date: number,
  assignee: string,
  attachements: any[]
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  url = environment.url;
  mytoken : string='';


  constructor(private http: HttpClient,private authservice:AuthService) { this.mytoken = authservice.getMyToken(); }

  addTask(boardId, task: Task) {
    let httpOptions = {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.mytoken 
    })
  }
    return this.http.post(`${this.url}/tasks/${boardId}`, task,httpOptions);
  }

  getTask(id) {
    let httpOptions = {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.mytoken 
    })
  }
    return this.http.get(`${this.url}/tasks/${id}`,httpOptions);
  }

  updateTask(id, task: Task) {
    let httpOptions = {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.mytoken 
    })
  } 
    return this.http.put(`${this.url}/tasks/${id}`,task,httpOptions);
    
  
  }

  addTaskComment(id, comment) {
    let httpOptions = {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.mytoken 
    })
  }
    return this.http.post(`${this.url}/tasks/${id}/comments`, { text: comment },httpOptions);
  }

  addTaskAttachement(id, name) {
    let httpOptions = {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.mytoken 
    })
  }
    return this.http.post(`${this.url}/tasks/${id}/attachements`, { name: name },httpOptions);
  }
}
