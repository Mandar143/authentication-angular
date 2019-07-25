import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { TokenStorage } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class MerchantAuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router,private tokenStorage:TokenStorage) {
    // console.log(this.router.config);
   }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
     // console.log(this.tokenStorage.decodeActions(), this.router.url);
    if (this.auth.loggedIn && this.auth.currentUser.isMerchant) { return true; }
    this.router.navigate(['merchant/login']);
    return false;
  }
}
