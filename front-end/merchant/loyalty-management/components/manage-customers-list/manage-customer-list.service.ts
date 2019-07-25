import { Injectable } from '@angular/core';
import { IpService } from 'src/app/services/ip.service';
import { QueryParamsModel } from 'src/app/shared/models/query-models/query-params.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ManageCustomerListService {

  params: any;

  constructor(
    private ipService: IpService
  ) { }

  getManagaeCustomerList(queryParams: QueryParamsModel): Observable<any> {

    queryParams.pageNumber += 1;
    return this.ipService.post('api/customer/getManageCustomersList', queryParams)
      .pipe(
        map(res => res.data)
      );
  }
}
