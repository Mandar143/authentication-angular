import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileItem, FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { FileTypeList } from './file-types';
import { MasterImportService } from './master-import.service';
const URL = environment.serverUrl + '/api/master-import/upload';

@Component({
  selector: 'app-master-import',
  templateUrl: './master-import.component.html',
  styleUrls: ['./master-import.component.scss']
})
export class MasterImportComponent implements OnInit {

  private target: any;
  fileTypes = FileTypeList;
  uploader: FileUploader;
  maxFileSize = 25 * 1024 * 1024;
  queueLimit = 4;
  allowedMimeType: string;
  masterImportForm: FormGroup;
  uploaderOptions: FileUploaderOptions;
  // @ViewChild('inputFile') InputFileVariable: ElementRef;

  constructor(private _formBuilder: FormBuilder, private masterImportService: MasterImportService) { }

  ngOnInit() {
    this.masterImportForm = this.initForm();
    this.allowedMimeType = this.allowMimeTypes().join(',');
    this.initUploader(this.initUploaderOptions());
  }

  initUploaderOptions() {
    return {
      url: URL,
      isHTML5: true,
      maxFileSize: (25 * 1024 * 1024),
      queueLimit: 4,
      allowedMimeType: this.allowMimeTypes(),
      headers: [{
        name: 'authentication-token',
        value: 'test'
      }],
      method: 'POST'
    };
  }

  initForm() {
    return this._formBuilder.group({
      fileType: ['', [Validators.required]]
    });
  }
  initUploader(uploaderOptions) {

    this.uploader = new FileUploader(uploaderOptions);

    this.uploader.onBuildItemForm = (fileItem: FileItem, form: any) => this.onBuildItemForm(fileItem, form);
    this.uploader.onAfterAddingFile = fileItem =>
      this.onAfterAddingFile(fileItem);
    this.uploader.onWhenAddingFileFailed = (item, filter, options) =>
      this.onWhenAddingFileFailed(item, filter, options);
    this.uploader.onCancelItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) =>
      this.onCancelItem(item, response, status, headers);
    this.uploader.onProgressItem = (fileItem: FileItem, progress: any) => this.onProgressItem(fileItem, progress);
    // this.uploader.onProgressAll = (progress:any) => this.onProgressAll(progress);
    this.uploader.onErrorItem = (item, response, status, headers) =>
      this.onErrorItem(item, response, status, headers);
    this.uploader.onSuccessItem = (item, response, status, headers) =>
      this.onSuccessItem(item, response, status, headers);
    this.uploader.onCompleteAll = () => this.onCompleteAll();

  }

  allowMimeTypes() {
    return [
      'text/csv'
    ];
  }

  updateFileName(filename: string) {
    return new Date().getTime() + '_' + filename;
  }

  onCancelItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    console.log(item);
  }

  onBuildItemForm(fileItem: FileItem, form: any) {
    form.append('fileType', fileItem['fileType']);
  }

  onAfterAddingFile(fileItem: FileItem): any {
    fileItem.withCredentials = false;
    const fileType = this.masterImportForm.get('fileType').value;
    const fileName = fileItem.file.name;
    fileItem['fileType'] = fileType;
    const fileNameWithType = `${fileType}_${fileItem.file.name}`;
    fileItem.file.name = this.updateFileName(fileNameWithType);

    fileItem['invalidType'] = false;

    if (this.checkInQueue(fileItem) || this.allowMimeTypes().indexOf(fileItem.file.type) === -1) {
      fileItem['invalidType'] = true;
      fileItem['invalidMessage'] = this.checkInQueue(fileItem) ? 'File Type Already in Queue' : 'Invalid File Type';
      // fileItem['isUploading'] = true;
      fileItem['isUploaded'] = true;
    }

  }

  onWhenAddingFileFailed(item, filter, options): any {
    console.log(item, filter)
  }

  onProgressItem(fileItem, progress): any {


  }

  async onSuccessItem(
    item: FileItem,
    response: string,
    status: number,
    headers: ParsedResponseHeaders
  ) {
  }

  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {

  }

  onCompleteAll() {

  }

  validedFields(e) {
    this.masterImportForm.markAsTouched();
    if (this.masterImportForm.valid) {
      return true;
    }
    return false;
  }

  formatBytes(bytes, decimalPoint = null) {
    if (bytes === 0) { return '0 Bytes'; }
    const k = 1000,
      dm = decimalPoint || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  getFileType(fileId) {
    const fileObj = this.fileTypes.find(file => file.id === fileId);
    if (fileObj) {
      return fileObj['name'];
    }
    return 'NA';
  }

  onChange(event: any): void {
    // this.target = event.target || event.srcElement;
    event.srcElement.value = '';
  }

  checkInQueue(item) {
    const fileCollection = this.uploader.queue.filter(
      file => file['fileType'] === item.fileType
    );
    return fileCollection.length > 1;
  }

  downloadSample(fileType) {
    window.location.href = fileType.path;
    /* this.masterImportService.getSampleFile(fileType).subscribe(Response => {
      console.log(Response);
    }, err => {
      console.log(err);
    }) */
  }
}
