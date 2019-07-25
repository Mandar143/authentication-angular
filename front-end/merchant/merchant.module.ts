import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { UserLogsComponent } from '../shared/components/user-logs/user-logs.component';
import { LayoutModule } from '../shared/layout/layout.module';
import { SharedModule } from '../shared/shared.module';
import { FeedbackDetailsComponent } from './components/feedback/feedback-details/feedback-details.component';
import { FeedbackListComponent } from './components/feedback/feedback-list/feedback-list.component';
import { ContributionComponent } from './components/index/analytics/contribution/contribution.component';
import { SaleComponent } from './components/index/analytics/sale/sale.component';
import { IndexComponent } from './components/index/index.component';
import { LoginComponent } from './components/login/login.component';
import { MasterImportComponent } from './components/master-import/master-import.component';
import { MerchantLayoutComponent } from './components/merchant-layout/merchant-layout.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CampaignROIComponent } from './components/reports/campaign-roi/campaign-roi.component';
import { RegistrationReportsComponent } from './components/reports/registration-reports/registration-reports.component';
import { ReportsComponent } from './components/reports/reports.component';
import { TransactionReportComponent } from './components/reports/transaction-report/transaction-report.component';
import { VoucherReportsComponent } from './components/reports/voucher-reports/voucher-reports.component';
import { UsersListComponent } from './components/users/users-list/users-list.component';
import { MerchantRoutingModule } from './merchant-routing.module';
import { ActivityComponent } from './components/index/analytics/activity/activity.component';
@NgModule({
  declarations: [
    MerchantLayoutComponent,
    LoginComponent,
    ProfileComponent,
    IndexComponent,
    UsersListComponent,
    MasterImportComponent,
    ReportsComponent,
    TransactionReportComponent,
    VoucherReportsComponent,
    RegistrationReportsComponent,
    CampaignROIComponent,
    FeedbackListComponent,
    FeedbackDetailsComponent,
    SaleComponent,
    ContributionComponent,
    ActivityComponent],
  imports: [
    CommonModule,
    LayoutModule,
    SharedModule,
    MerchantRoutingModule,
    HttpClientModule,
    FileUploadModule,
    NgxChartsModule,
    MatTabsModule,
    NgxDaterangepickerMd.forRoot()
  ],
  providers: [
    JwtHelperService
  ],
  entryComponents: [
    UserLogsComponent,
    FeedbackDetailsComponent
  ]
})
export class MerchantModule { }
