import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InvitationsService {
  url = environment.url;
  mytoken : string='';

  constructor(private http: HttpClient,private authservice:AuthService) {
    this.mytoken = authservice.getMyToken();
   }

  getInvitations() {
    let httpOptions = {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.mytoken 
    })
  };
    return this.http.get<any[]>(`${this.url}/invitations`,httpOptions);
  }

  inviteUser(boardId, email) {
    let httpOptions = {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.mytoken 
    })
  };
    return this.http.post(`${this.url}/invitations/${boardId}`, { email },httpOptions);
  }

  answerInvitation(invitationId, accept: boolean) {
    let httpOptions = {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.mytoken 
    })
  };
    return this.http.post(`${this.url}/invitations/${invitationId}/${accept ? 1 : 0}`, {},httpOptions);
  }
}
