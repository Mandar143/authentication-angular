import { Injectable } from '@angular/core';
import { IpService } from 'src/app/services/ip.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterImportService {

  constructor(private ipService: IpService) { }

  getSampleFile(params): Observable<any> {
    return this.ipService.post('api/master-import/getSampleFile', params);
  }
}
