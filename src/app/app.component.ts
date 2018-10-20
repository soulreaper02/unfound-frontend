import { Component } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'unfound';

  tabledata : [{
    vehicleid : string,
    frame : string,
    powertrain : string,
    wheelcount : string,
    vehicletype : string,
    upload : string
  }]

  tabledata2 : [{
    vehicleid : string,
    frame : string,
    powertrain : string,
    wheelcount : string,
    vehicletype : string,
    upload : string
  }]

  filedata : [{
    filename : String,
    filepath : String
  }]
  

  selectedFile: File = null;
  constructor(private http: HttpClient) { }
  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    const regex = new RegExp("(.*?)\.(xml)$")
    if (regex.test(this.selectedFile.name)) {
      const formData = new FormData();
      formData.append('upload', this.selectedFile, this.selectedFile.name)
      this.http.post('http://localhost:9000/fileupload', formData, {
        responseType: 'text',
        reportProgress: true,
        observe: 'events'
      }).subscribe(res => {
        if (res.type === HttpEventType.UploadProgress) {
          let uploadProgress = Math.round(res.loaded / res.total * 100 ) + '%';
          console.log('Upload Progress: ', uploadProgress);
        } else if (res.type === HttpEventType.Response) {
          let result = JSON.parse(res.body);
          if (result) {
            this.http.post('http://localhost:9000/process', result, {
              responseType: 'text'
            }).subscribe( res => {
              let data = JSON.parse(res);
              console.log(data);
              this.tabledata = data;
            })
          }
        }
      })
    } else {
      alert('Unsupported file type !!!');
    }
  }

  checkTab(event) {
    if (event.index == '1') {
      this.http.get('http://localhost:9000/getallfiles', {
        responseType : 'text',
      }).subscribe( res => {
        let data = JSON.parse(res);
        console.log(data);
        this.filedata = data;
      })
    }
  }

  LinkToFile(filepath: string) {
    console.log(filepath);
    window.open(filepath);
  }

  getReports(filename : string) {
    console.log(filename);
    const formData = new FormData();
    formData.append('filename', filename)
    this.http.post('http://localhost:9000/getreports', formData, {
      responseType : 'text',
    }).subscribe (res => {
      let data = JSON.parse(res);
      console.log(data);
      this.tabledata2 = data;
    })
  }
}
