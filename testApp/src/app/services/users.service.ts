import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  url = environment.url;

  constructor(private http: HttpClient) { }

  startPremium(token) {
    return this.http.post(`${this.url}/users/membership`, { card_token: token });
  }

  stopPremium() {
    return this.http.delete(`${this.url}/users/membership`);
  }

  getInvoices() {
    return this.http.get(`${this.url}/users/membership/invoices`);
  }

  getUserData() {
    return this.http.get(`${this.url}/users`);
  }

  updateUserData(data) {
    return this.http.put(`${this.url}/users`, data);
  }

  removeUser() {
    return this.http.delete(`${this.url}/users`);
  }
}