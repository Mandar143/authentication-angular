import { Injectable } from '@angular/core';
import { IpService } from '../../../../../../services/ip.service';
import { QueryParamsModel } from '../../../../../../shared/models/query-models/query-params.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerTransactionsService {
  params: any;

  constructor(
    private ipService: IpService
  ) { }
  getTransactions(queryParams: QueryParamsModel): Observable<any> {
    queryParams.pageNumber += 1;
    return this.ipService.post('api/merchant-customers/getTransactions', queryParams)
      .pipe(map(res => res.data));
 }
  getOrderDetails(params): Observable<any> {
    return this.ipService.post('api/merchant-customers/getOrderDetails', params)
      .pipe(map(res => res.data));
  }
}
