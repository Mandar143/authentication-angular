import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/customer/models/user.model';
import { IpService } from '../ip.service';
import { TokenStorage } from './token-storage.service';
import Swal from 'sweetalert2';
import { SweetAlertType } from 'sweetalert2';
import { ApiResult } from 'src/app/shared/models/api-result';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  loggedIn: boolean;
  currentUser: User;
  response = {
    next: (res: ApiResult) => this.handleResult(res),
    error: err => this.handleError(err),
    complete: () => this.complete(),
  };
  constructor(
    private tokenStorage: TokenStorage,
    public snackBar: MatSnackBar,
    private router: Router,
    private ipService: IpService) {

    const decodedUser = this.tokenStorage.decodeUserFromToken();
    if (decodedUser) {
      this.setCurrentUser(decodedUser);
      this.isSessionExpire();
    }
  }

  setCurrentUser(decodedUser = null) {
    this.currentUser = new User();
    if (!decodedUser) {
      decodedUser = this.tokenStorage.decodeUserFromToken();
    }
    try {
      this.loggedIn = true;
      for (const key in decodedUser) {
        if (key) {
          this.currentUser[key] = decodedUser[key];
        }
      }

    } catch (error) {
      this.logout();
    }
    /* try {
      this.loggedIn = true;
      this.currentUser.id = decodedUser.user_id;
      this.isVerified = false;
      this.currentUser.sub_merchant_id = decodedUser.sub_merchant_id;
      this.currentUser.gender = decodedUser.gender;
      this.currentUser.contact = decodedUser.contact;
      this.currentUser.sub_merchant_location_id = decodedUser.sub_merchant_location_id;
      this.currentUser.avatar = decodedUser.marital_status;
      this.currentUser.email = decodedUser.email;
      this.currentUser.created_by = decodedUser.created_by;
      this.currentUser.username = decodedUser.username;
      this.currentUser.first_name = decodedUser.first_name;
      this.currentUser.last_name = decodedUser.last_name;
      this.currentUser.status = decodedUser.status;
      this.currentUser.isLoggedin = decodedUser.isLoggedin;
      this.currentUser.user_type_id = decodedUser.user_type_id;
      this.isCustomer = decodedUser.isCustomer;

    } catch (error) {
      this.tokenStorage.clear();
    } */
  }

  alertToUser(message, className: string) {
    setTimeout(() => {
      this.snackBar.open(message, '', { horizontalPosition: this.horizontalPosition, duration: 3000, panelClass: [className] });
    }, 300);
  }

  swalFireFunction(title: string, message: string, type: SweetAlertType) {
    return Swal.fire(title, message, type);
  }

  logout() {
    if (!this.currentUser.isCustomer) {
      if (this.isSessionExpire()) {
        this.logoutUser().subscribe(this.response);
      }
    } else {
      this.clearData();
    }

    // const decodedUser =this.tokenStorage.decodeUserFromToken();
  }

  clearData() {
    let navigateUrl = '/login';
    if (!this.currentUser) {
      navigateUrl = '/';
    }
    if (this.currentUser && !this.currentUser.isCustomer) {
      navigateUrl = '/merchant/login'
    }
    // this.currentUser.clear();
    this.currentUser = null;
    this.loggedIn = false;
    this.tokenStorage.clear();
    this.snackBar.dismiss();
    this.router.navigateByUrl(navigateUrl);
  }

  logoutUser(): Observable<ApiResult> {
    return this.ipService.post('api/merchant-users/logout', null);
  }

  handleResult(res: ApiResult) {
    this.clearData();
  }

  handleError(err) {
    this.clearData();
  }

  complete() {
    // this.clearData();
  }

  isSessionExpire(): boolean {
    if (this.currentUser && 'iat' in this.currentUser) {
      const iat = this.currentUser['iat'];
      const sessionTimeStamp = iat * 1000;
      return new Date().getTime() > sessionTimeStamp;
    }
    return false;
  }
}
