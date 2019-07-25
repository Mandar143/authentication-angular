import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IpService } from '../../../../services/ip.service';
import { QueryParamsModel } from '../../../../shared/models/query-models/query-params.model';

@Injectable({
  providedIn: 'root'
})
export class GetMobileNumberChangeLogService {
  params: any;

  constructor(
    private ipService: IpService
  ) { }


  getMobileNumberChangeLog(queryParams: QueryParamsModel): Observable<any> {

    queryParams.pageNumber += 1;
    return this.ipService.post('api/merchant-customers/getMobileNumberChangeLog', queryParams)
      .pipe(
        map(res => res.data)
      );
  }
}
