import { Component } from '@angular/core';
import { FileService } from './file.service';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { saveAs } from 'file-saver';
import { MetadataFile } from './metadata-file.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  metadataFiles: MetadataFile[] = [];
  uploadFileStatus: any = { status: '', requestType: '', percent: 0 };
  loadingFiles: boolean = false;
  downloadFileStatus: { [fileName: string]: { status: string, percent: number } } = {};
  constructor(private fileService: FileService) {}

  onUploadFile(files: File[]) {
    const formData: FormData = new FormData();

    for (const file of files) {
      formData.append('files', file, file.name);
      
    }
    formData.append('uploadedBy', 'daelhum@correo.com');

    this.loadingFiles = true;
    this.fileService.uploadFile(formData).subscribe({
      next: (event) => {
        this.reportProgess(event);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.loadingFiles = false;
      },
      complete: () => {
        this.loadingFiles = false;
        this.uploadFileStatus.status = '';
        this.uploadFileStatus.requestType = '';
        this.uploadFileStatus.percent = 0;
      },
    });
  }

  onDownloadFile(fileName: string, total:number) {
    this.downloadFileStatus[fileName] = {status: 'progress', percent: 0};
    this.fileService.downloadFile(fileName).subscribe({
      next: (event) => {
        this.reportProgess(event, fileName, total);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
      complete: () => this.downloadFileStatus[fileName] = {status: '', percent: 0}
    });
  }

  reportProgess(event: HttpEvent<Blob | MetadataFile[]>, downloadFileName?:string,downloadTotal?:number) {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.updateStatus(event.loaded, event.total!, 'Uploading');
        break;
      case HttpEventType.DownloadProgress:
        this.downloadFileStatus[downloadFileName] = {status: 'progress', percent: Math.round((event.loaded / downloadTotal) * 100)}
        break;
      case HttpEventType.ResponseHeader:
        console.log('Header returned');
        break;
      case HttpEventType.Response:
        if (event.body instanceof Array) {
          //Upload logic
          event.body.forEach((metadataFile) =>{
            this.metadataFiles.unshift(metadataFile);
          }
            
          );
        } else {
          //Download logic
          saveAs(
            new File([event.body!], event.headers.get('File-Name')!, {
              type: `${event.headers.get('Content-Type')};charset=utf-8`,
            })
          );
        }
        break;
    }
  }
  
  
  updateStatus(loaded: number, total: number, requestType: string) {
    if (requestType === 'Uploading') {
      this.uploadFileStatus.status = 'progress';
      this.uploadFileStatus.requestType = requestType;
      this.uploadFileStatus.percent = Math.round((loaded / total) * 100);
      console.table(this.uploadFileStatus);
    }
  }




  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    this.onUploadFile(files);
    console.log(files);
  }

  onDragEnter(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    console.log(files);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    console.log(files);
  }

  resetProgress() {
    this.uploadFileStatus.status = '';
    this.uploadFileStatus.requestType = '';
    this.uploadFileStatus.percent = 0;
  }
}
