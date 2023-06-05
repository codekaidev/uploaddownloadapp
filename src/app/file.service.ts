import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private server: string = 'http://localhost:8085';

  constructor(private httpClient: HttpClient) {}

  uploadFile(formData: FormData): Observable<HttpEvent<string[]>> {
    return this.httpClient.post<string[]>(
      `${this.server}/api/v1/file/upload`,
      formData,
      {
        reportProgress: true,
        observe: 'events',
      }
    );
  }

  downloadFile(fileName: string): Observable<HttpEvent<Blob>> {
    return this.httpClient.get(
      `${this.server}/api/v1/file/download/${fileName}`,
      {reportProgress:true,
      observe: 'events',
    responseType: 'blob'}
    );
  }
}
