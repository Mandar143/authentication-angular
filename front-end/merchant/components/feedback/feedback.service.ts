import { Injectable } from '@angular/core';
import { IpService } from 'src/app/services/ip.service';
import { QueryParamsModel } from 'src/app/shared/models/query-models/query-params.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  constructor(
      private ipService: IpService
  ) { }

  getList(queryParams: QueryParamsModel): Observable<any> {

      queryParams.pageNumber += 1;

      return this.ipService.post('api/merchant-customers/get-customer-feedback', queryParams)
          .pipe(map(res => res.data));
  }

  getSnapshot(): Observable<any> {
    return this.ipService.post('api/merchant-customers/get-customer-feedback-snapshot', null);
  }
}
