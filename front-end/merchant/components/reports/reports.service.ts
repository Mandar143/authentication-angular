import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IpService } from 'src/app/services/ip.service';
import { map } from 'rxjs/operators';
import { QueryParamsModel } from 'src/app/shared/models/query-models/query-params.model';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(
    private ipService: IpService) { }

  params: any;
  getTransactions(queryParams?: QueryParamsModel): Observable<any> {
    queryParams.pageNumber += 1;
    return this.ipService.post('api/merchant-users/get-transactions-report', queryParams).pipe(
      map(res => res.data)
    );
  }

  voucherReports(queryParams: QueryParamsModel): Observable<any> {
    queryParams.pageNumber += 1;
    return this.ipService.post('api/merchant-users/voucherReports', queryParams)
      .pipe(
        map(res => res.data)
      );
  }

  getRegisteredCustomers(queryParams: QueryParamsModel): Observable<any> {
    queryParams.pageNumber += 1;
    return this.ipService.post('api/customer/get-registered-customers', queryParams)
      .pipe(
        map(res => res.data)
      );
  }

  /* downloadCSV() {
    return this.ipService.get('api/merchant-users/voucherReportsDownload', '')
      .pipe(
        map(res => res.data.voucher_export)
      );
  } */

  getCampaignROI(queryParams: QueryParamsModel): Observable<any> {
    queryParams.pageNumber += 1;
    return this.ipService.post('api/merchant-campaigns/campaign-roi', queryParams)
      .pipe(
        map(res => res.data)
      );
  }

  getTransactionSnapshot(): Observable<any> {
    return this.ipService.post('api/merchant-users/get-transaction-snapshot', null);
  }

  getCustomerRegistrationSnapshot(): Observable<any> {
    return this.ipService.post('api/customer/get-snapshot', null);
  }

  getVoucherRedemptionSnapshot(): Observable<any> {
    return this.ipService.post('api/merchant-users/get-voucher-redemption-snapshot', null);
  }
}
