import { Injectable } from '@angular/core';
import { IpService } from '../../../../services/ip.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResult } from 'src/app/shared/models/api-result';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ManageCustomersService {

  constructor(private ipService: IpService) { }


  getUsers(params): Observable<any> {
    // params = new HttpParams().set('query',params);
    // return this.ipService.get('api/customer/customer-details', params);
    return this.ipService.post('api/customer/customer-details', params);

  }

  searchCustomer(params) {
    return this.ipService.post('api/customer/search-customer', params).pipe(
      map(result => {
        if ('statusCode' in result.data) {
          return { message: result.message, statusCode: result.data.statusCode };
        }
        return result.data || null;
      })
    );
  }
  getUsersSuggestion(params): Observable<any> {
    return this.ipService.post('api/customer/customer-suggestion', params).pipe(map((res: ApiResult) => {
      return res.data['customerDetails'] || [];
    }));
  }
  checkMobileNumber(params): Observable<ApiResult> {
    return this.ipService.post('api/customer/check-mobile', params);

  }

  addCustomer(params): Observable<ApiResult> {
    return this.ipService.post('api/merchant-customers/add-customer', params);
  }

  verifyEmail(params): Observable<ApiResult> {
    return this.ipService.post('api/merchant-customers/verifyEmail', params);
  }
  getVoucherDetails(params) {
    return this.ipService.post('api/customer/getVoucherDetails', params)
      .pipe(
        map(res => res.data.voucher_details)
      );
  }
}
