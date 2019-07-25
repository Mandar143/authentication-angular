import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatButtonToggleModule, MatCardModule, MatDialogModule, MatDividerModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatSelectModule, MatTableModule, MatTabsModule } from '@angular/material';
import { MobileNumberChangeComponent } from '../../shared/components/mobile-number-change/mobile-number-change.component';
import { LayoutModule } from '../../shared/layout/layout.module';
import { SharedModule } from '../../shared/shared.module';
import { CustomerRegistrationComponent } from './components/customer-registration/customer-registration.component';
import { GetHomeBranchChangeRequestsComponent } from './components/get-home-branch-change-requests/get-home-branch-change-requests.component';
import { GetMobileNumberChangeLogComponent } from './components/get-mobile-number-change-log/get-mobile-number-change-log.component';
import { ManageCustomersComponent } from './components/manage-customers/manage-customers.component';
import { CustomerTransactionsComponent } from './components/manage-customers/other-information/customer-transactions/customer-transactions.component';
import { SearchCustomerComponent } from './components/manage-customers/search-customer/search-customer.component';
import { LoyaltyManagementRoutingModule } from './loyalty-management-routing.module';
import { VouchersCouponsListComponent } from './components/manage-customers/other-information/vouchers-coupons-list/vouchers-coupons-list.component';
import { OfferCouponsListComponent } from './components/manage-customers/other-information/offer-coupons-list/offer-coupons-list.component';
import { OrderDetailsLogComponent } from './components/manage-customers/other-information/customer-transactions/order-details-log/order-details-log.component';
import { ManageCustomersListComponent } from './components/manage-customers-list/manage-customers-list.component';

@NgModule({
  declarations: [
    ManageCustomersComponent,
    CustomerRegistrationComponent,
    GetMobileNumberChangeLogComponent,
    GetHomeBranchChangeRequestsComponent,
    CustomerTransactionsComponent,
    SearchCustomerComponent,
    VouchersCouponsListComponent,
    OfferCouponsListComponent,
    OrderDetailsLogComponent,
    ManageCustomersListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LoyaltyManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatDividerModule,
    MatSelectModule,
    LayoutModule,
    MatDialogModule,
    MatTabsModule,
    MatButtonToggleModule
  ],
  entryComponents: [
    MobileNumberChangeComponent,
    OrderDetailsLogComponent
  ]
})
export class LoyaltyManagementModule { }
