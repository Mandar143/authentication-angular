import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IpService } from '../../../../services/ip.service';
import { QueryParamsModel } from 'src/app/shared/models/query-models/query-params.model';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserListService {
  constructor(
    private ipService: IpService) { }
  params: any;

  getAllUsers(queryParams: QueryParamsModel): Observable<any> {
    queryParams.pageNumber += 1;
    if (!queryParams.sortField) {
      queryParams.sortField = "created_at";
    }
    return this.ipService.post('api/merchant-users/list', queryParams).pipe(
      map(res => res.data)
    );
  }

  getSubMerchantDetails(params): Observable<any> {
    return this.ipService.post('api/merchant-details/getSubMerchantDetails', params)
  }

  getSubMerchantLocations(params): Observable<any> {
    return this.ipService.post('api/merchant-details/getSubMerchantLocations', params)
  }

  addUser(params): Observable<any> {
    return this.ipService.post('api/merchant-users/addUser', params)
  }

  updateUser(params): Observable<any> {
    return this.ipService.post('api/merchant-users/updateUser', params)
  }

  getUserTypes(): Observable<any> {
    return this.ipService.get('api/merchant-users/getUserTypes', '')
  }

  checkUsername(params): Observable<any> {
    return this.ipService.post('api/merchant-users/checkUsername', params)
  }

  deleteUser(params): Observable<any> {
    return this.ipService.post('api/merchant-users/deleteUser', params)
  }

  getSubMerchantPosLocations(params): Observable<any> {
    return this.ipService.post('api/merchant-details/getSubMerchantPosLocations', params)
      .pipe(map(res => res.data));
  }
}