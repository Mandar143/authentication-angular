import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterDeactivateGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    console.log('RegisterDeactivateGuard', component.canDeactivate());
    confirm('WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.');


    if (component.canDeactivate()) {
      return true;
    }

  }
}
