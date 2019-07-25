import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, NavigationEnd, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Menu, TokenStorage } from './token-storage.service';
import { Location } from '@angular/common';
import { filter, tap, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class RouterGuard implements CanActivate {
    constructor(
        private auth: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private tokenStorage: TokenStorage,
        private location: Location) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        // console.log(state.url);
        if (!this.auth.loggedIn) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }
        const allActions = this.tokenStorage.decodeActions();

        let result = ['/dashboard', '/merchant'];
        const collect = (actions: Menu[], parentMenu: string = '') => {
            actions.forEach((action) => {
                let path = action.path;
                if (parentMenu) {
                    path = parentMenu + '/' + path;
                }
                result.push(path);
                if (Array.isArray(action.children)) {
                    collect(action.children, path);
                }
            });
            // console.log(result);
            // return result;
        };

        collect(allActions);


        const subscription = this.router.events.pipe(
            filter(event => (event instanceof NavigationEnd)),
        ).subscribe(
            (routeData: NavigationEnd) => {
                // console.log(state, routeData.url, result.includes(routeData.url), this.auth.loggedIn);
                // this.tokenStorage.setRouteData(environment.currentNavigateRoute, routeData.url);
                if (!this.auth.loggedIn) {
                    result = [];
                }
                if (result.length && !result.includes(routeData.url)) {
                    this.router.navigate(['/']);
                    return false;
                }

                return true;
            },
            error => { subscription.unsubscribe(); },
            () => {
                subscription.unsubscribe();
                console.log('subscribe complete');
            }
        );
        return true;
        //  console.log(result, result.includes(state.url));
        // console.log(next, state.url, location);
        // console.log(this.router, this.route);

        //console.log(result.includes(state.url), this.router.isActive(event.url, true));
        //return result.includes(state.url);

    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log('----------');

    }


}
