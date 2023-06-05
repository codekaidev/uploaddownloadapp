import { Component } from '@angular/core';
import { FileService } from './file.service';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  fileNames: string[] = [];
  fileStatus: any = {status: '', requestType: '', percent:0};

  constructor(private fileService: FileService) {}

  onUploadFile(files: File[]) {
    const formData: FormData = new FormData();
    
    for (const file of files) {
      formData.append('files', file, file.name);
    }
    
    // files.forEach((file) => {
    //   formData.append('files', file, file.name);
    // });

    this.fileService.uploadFile(formData).subscribe({
      next: (event) => {
        console.log(event);
        this.reportProgess(event);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }

  onDownloadFile(fileName: string) {
    this.fileService.downloadFile(fileName).subscribe({
      next: (event) => {
        console.log(event);
        this.reportProgess(event);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }

  reportProgess(event: HttpEvent<string[] | Blob>) {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.updateStatus(event.loaded, event.total!, 'Uploading');
        break;
      case HttpEventType.DownloadProgress:
        this.updateStatus(event.loaded, event.total!, 'Downloading');
        break;
      case HttpEventType.ResponseHeader:
        console.log('Header returned');
        break;
      case HttpEventType.Response:
        if (event.body instanceof Array) {
          //Upload logic
          event.body.forEach((fileName) => this.fileNames.unshift(fileName));
        } else {
          //Download logic
          saveAs(
            new File([event.body!], event.headers.get('File-Name')!, {
              type: `${event.headers.get('Content-Tye')};charset=utf-8`,
            })
          );
        }
        break;
    }
  }
  updateStatus(loaded: number, total: number, requestType: string) {
    this.fileStatus.status = 'progress';
    this.fileStatus.requestType = requestType;
    this.fileStatus.percent = Math.round(100 * loaded/ total);
  }
}
