import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RegisterService } from 'src/app/auth/components/register/services/register.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterGuard implements CanActivate {
  isAllowRegister: boolean;
  constructor(private registerService: RegisterService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {


    const userInfo = this.registerService.getUserInfo();

    this.isAllowRegister = this.registerService.isAllowRegister;

    if (userInfo) {
      const currentTime = new Date().valueOf();
      this.isAllowRegister = userInfo.isAllowRegister;
      if ((currentTime > userInfo.loginTime)) {
        this.registerService.clear();
        this.isAllowRegister = false;
      }
    }

    if (this.isAllowRegister) {
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }
}
