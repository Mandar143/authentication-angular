import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageCustomersComponent } from './components/manage-customers/manage-customers.component';
import { CustomerRegistrationComponent } from './components/customer-registration/customer-registration.component';
import { GetMobileNumberChangeLogComponent } from './components/get-mobile-number-change-log/get-mobile-number-change-log.component';
import { GetHomeBranchChangeRequestsComponent } from './components/get-home-branch-change-requests/get-home-branch-change-requests.component';

const routes: Routes = [
  { path: '', redirectTo: 'manage-customers', pathMatch: 'full' },
  { path: 'manage-customers', component: ManageCustomersComponent },
  { path: 'customer-register', component: CustomerRegistrationComponent },
  { path: 'get-mobile-number-change-log', component: GetMobileNumberChangeLogComponent },
  { path: 'get-home-branch-change-requests', component: GetHomeBranchChangeRequestsComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoyaltyManagementRoutingModule { }
