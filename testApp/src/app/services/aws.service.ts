import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AwsService {
  url = environment.url;

  constructor(private http: HttpClient) { }

  getSignedUploadRequest(name, type, taskId) {
    return this.http.get(`${this.url}/aws/sign-s3?file-name=${name}&file-type=${type}&task=${taskId}`);
  }

  uploadFile(url, file) {
    return this.http.put(url, file);
  }

  getFileSignedRequest(name, taskId) {
    return this.http.get(`${this.url}/aws/file?file-name=${name}&task=${taskId}`);
  }

  deleteFile(name, taskId) {
    return this.http.delete(`${this.url}/aws/file/${name}/${taskId}`);
  }
}
