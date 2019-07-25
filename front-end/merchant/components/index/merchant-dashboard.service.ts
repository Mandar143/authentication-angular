import { Injectable } from '@angular/core';
import { IpService } from 'src/app/services/ip.service';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/shared/models/api-result';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MerchantDashboardService {

  constructor(private ipService: IpService, private authService: AuthService) { }

  getDashboardDetails(params?): Observable<{}> {
    return this.ipService.post('api/merchant-users/merchant-dashboard-details', params)
      .pipe(
        map(res => res.data)
      );
  }
}
