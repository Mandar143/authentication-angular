import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IpService } from '../../../../services/ip.service';
import { QueryParamsModel } from '../../../../shared/models/query-models/query-params.model';

@Injectable({
  providedIn: 'root'
})
export class GetHomeBranchChangeRequestsService {
  params: any;

  constructor(
    private ipService: IpService
  ) { }



  getHomeBranchChangeRequests(queryParams: QueryParamsModel): Observable<any> {
    queryParams.pageNumber += 1;
    return this.ipService.post('api/merchant-customers/getHomeBranchChangeRequests', queryParams)
      .pipe(
        map(res => res.data)
      );
  }




}
