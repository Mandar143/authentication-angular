import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../services/authentication/auth.guard';
import { MerchantAuthGuard } from '../services/authentication/merchant.guard';
import { RouterGuard } from '../services/authentication/router.gaurd';
import { UserEditComponent } from '../shared/components/user-edit/user-edit.component';
import { FeedbackListComponent } from './components/feedback/feedback-list/feedback-list.component';
import { IndexComponent } from './components/index/index.component';
import { LoginComponent } from './components/login/login.component';
import { MasterImportComponent } from './components/master-import/master-import.component';
import { MerchantLayoutComponent } from './components/merchant-layout/merchant-layout.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CampaignROIComponent } from './components/reports/campaign-roi/campaign-roi.component';
import { RegistrationReportsComponent } from './components/reports/registration-reports/registration-reports.component';
import { TransactionReportComponent } from './components/reports/transaction-report/transaction-report.component';
import { VoucherReportsComponent } from './components/reports/voucher-reports/voucher-reports.component';
import { UsersListComponent } from './components/users/users-list/users-list.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: MerchantLayoutComponent,
    canActivate: [AuthGuard, RouterGuard, MerchantAuthGuard],
    children: [
      { path: '', redirectTo: 'index', pathMatch: 'full' },
      { path: 'index', component: IndexComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'user-edit', component: UserEditComponent },
      { path: 'users-list', component: UsersListComponent },
      { path: 'loyalty-management', loadChildren: './loyalty-management/loyalty-management.module#LoyaltyManagementModule' },
      { path: 'master-import', component: MasterImportComponent },
      { path: 'reports/transaction-reports', component: TransactionReportComponent },
      { path: 'reports/voucher-reports', component: VoucherReportsComponent },
      { path: 'reports/registration-reports', component: RegistrationReportsComponent },
      { path: 'reports/campaign-roi', component: CampaignROIComponent },
      { path: 'feedback/list', component: FeedbackListComponent }

      /* { path: 'index', loadChildren: './index/index.module#IndexModule' },
      { path: 'profile', loadChildren: './profile/profile.module#ProfileModule' } */
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MerchantRoutingModule { }
