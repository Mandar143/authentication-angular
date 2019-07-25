import { Injectable } from '@angular/core';
import { IpService } from 'src/app/services/ip.service';
import { startWith, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  params: any;

  constructor(
    private ipService: IpService,
    private authService: AuthService) { }

  getUserProfileDetails(params){
    return this.ipService.get('api/merchant-users/getUserProfileDetails', params)
    .pipe(
      startWith(),
      map( res => {
        // console.log(res);
        if (!res || !res.data) {
          this.authService.alertToUser('Something went wrong while User Type list loading', 'red-snackbar');
        } else {
          return res.data;
        }
      })
    );
    }
}
