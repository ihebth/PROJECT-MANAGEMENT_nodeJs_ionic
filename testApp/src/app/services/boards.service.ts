import { HttpClient,HttpHeaders} from '@angular/common/http';

import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Storage } from '@ionic/storage';
const TOKEN_KEY='access_token';

@Injectable({
  providedIn: 'root'
})
export class BoardsService {

  url = environment.url;
  mytoken : string='';

  constructor(private http: HttpClient,private authservice:AuthService,private storage:Storage) { 

    this.mytoken = authservice.getMyToken();
    console.log("my token construcotr  :",this.mytoken);
  }

  getBoards() {

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //       'Authorization':'Bearer'+this.storage.get(TOKEN_KEY).then((value) => {})
    //   })
    // };;

    console.log("my token getBoards  :",this.mytoken);

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.mytoken 
      })
    };
  
  return this.http.get(`${this.url}/boards` ,httpOptions)
   
  }

  addBoard(name, desc) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.mytoken 
      })
    };
    return this.http.post(`${this.url}/boards`, { name, desc },httpOptions);
  }

  getBoardById(id) {
    let httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.mytoken 
    })
  };
    return this.http.get(`${this.url}/boards/${id}`,httpOptions);
  }

  updateBoard(id, name, desc) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.mytoken 
      })
    };
    return this.http.put(`${this.url}/boards/${id}`, { name, desc },httpOptions);
  }

  deleteBoardById(id) {
    let httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.mytoken 
    })
  };
    return this.http.delete(`${this.url}/boards/${id}`,httpOptions);
  }

  deleteTaskInBoard(boardId, taskId) {
    let httpOptions = {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.mytoken 
    })
  };
    return this.http.delete(`${this.url}/boards/${boardId}/${taskId}`,httpOptions);
  }
}
