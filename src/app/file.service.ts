import { HttpClient, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { MetadataFile } from './metadata-file.model';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private server: string = 'http://localhost:8085';

  constructor(private httpClient: HttpClient) {}

  uploadFile(formData: FormData): Observable<HttpEvent<MetadataFile[]>> {
    return this.httpClient.post<MetadataFile[]>(
      `${this.server}/api/v1/upload-download-file/upload`,
      formData,
      {
        params: new HttpParams().set('uploadedBy', 'xxx'),
        headers: new HttpHeaders().set('Upload-Provider', 'uploadDownloadAWSS3StorageService'),
        reportProgress: true,
        observe: 'events'
      }
    );
  }

  downloadFile(fileName: string): Observable<HttpEvent<Blob>> {
    return this.httpClient.get(
      `${this.server}/api/v1/upload-download-file/download/${fileName}`,
      {
        headers: new HttpHeaders().set('Upload-Provider', 'uploadDownloadAWSS3StorageService'),
        reportProgress: true,
        observe: 'events',
        responseType: 'blob'
      }
    );
  }
}
