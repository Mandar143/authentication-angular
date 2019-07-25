import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription, of } from 'rxjs';
import { User } from '../../../../customer/models/user.model';
import { AuthService } from '../../../../services/authentication/auth.service';
import { ManageCustomersService } from './manage-customers.service';
import { SearchCustomerComponent, SearchCustomer } from './search-customer/search-customer.component';
import { TypesUtilsService } from 'src/app/shared/services/types-utils.service';
import { CapsLettersPipe } from 'src/app/shared/pipes/caps-letters.pipe';
import { DateConstant } from 'src/app/shared/components/constant/date-constant';

export interface SelectedData {
  user: User;
  action: string;
}
@Component({
  selector: 'app-manage-customers',
  templateUrl: './manage-customers.component.html',
  styleUrls: ['./manage-customers.component.scss'],
  providers: [CapsLettersPipe]
})
export class ManageCustomersComponent implements OnInit, OnDestroy, AfterViewInit {
  customerForm: FormGroup;
  showReg: boolean;
  showEdit: boolean;
  showMsg: boolean;
  user: User;
  isEdit: boolean;
  showAddBtn: boolean = true;
  cardTitle: string;
  showData: boolean;
  showEditBtn: boolean;
  showBranch: boolean;
  customer_loyalty_id: any;
  showBranchBtn: boolean;
  subscriptions: Subscription[] = [];
  milestoneDetails: any[];
  showCoupons: boolean = true;
  error: [];
  isDestroy: boolean;
  voucher_details: any = [];
  customer = null;
  milestoneNames = { '2': 'First', '3': 'Second', '4': 'Third', '5': 'Fourth', '6': 'Fifth', '7': 'Sixth', '8': 'Seventh' };
  customerMilestone: any;
  currentMilestone: any;
  currentPurchaseValue: any;
  totalPurchaseValue: any;
  eachMilestone: number;
  calculatedWidth: number;
  progressWidth: number;
  @ViewChild(SearchCustomerComponent) private searchCustomerComponent: SearchCustomerComponent;
  currentUserTypeId: number;
  isPosAdmin: boolean;
  customerSerarch: SearchCustomer;
  dateFormate: any;
  homeBranchChangeFlag: boolean;
  mobileChangeFlag: boolean;
  constructor(
    private managecustomersservice: ManageCustomersService,
    private authService: AuthService,
    private manageCustomerService: ManageCustomersService,
    private typesUtilsService: TypesUtilsService
  ) { }

  ngOnInit() {
    // Date formate as 'dd MMM yyyy'
    this.dateFormate = DateConstant.dateFormate;
    this.homeBranchChangeFlag = true;
    this.mobileChangeFlag = true;
    this.currentUserTypeId = this.authService.currentUser.user_type_id
    if (this.currentUserTypeId === 5) {
      this.isPosAdmin = true;
    } else {
      this.isPosAdmin = false;
    }
  }

  ngAfterViewInit() {
    // console.log(this.searchCustomerComponent);
    // this.searchCustomerComponent.searchLabelField.nativeElement.focus();
  }
  isVerified(element): boolean {
    return element === 1;
  }

  resetsearchCustomer() {
    const searchCustomer = this.searchCustomerComponent.customerSearch;
    const labelControl = searchCustomer.get('search_label');
    searchCustomer.get('search_by_value').reset();
    labelControl.clearValidators();
    labelControl.reset();

  }
  customerView(event) {
    // console.log(event);

  }
  getCustomer(customer) {
    const element = document.querySelector('.scrollViewPanel');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      this.customer = null;
    }
    this.showAddBtn = true;
    this.showReg = false;
    this.customer = customer;
    if (customer) {
      if (customer.loyalty_details) {
        this.milestoneDetails = customer.loyalty_details;
        this.customerMilestone = customer.customer_details.away_from_next_milestone;
        this.currentMilestone = customer.customer_details.current_milestone_id;
        this.currentPurchaseValue = customer.customer_details.current_purchase_value;
        this.totalPurchaseValue = this.milestoneDetails[this.milestoneDetails.length - 1].milestone_reach_at;
        this.eachMilestone = 100 / (this.milestoneDetails.length - 1);
        for (let milestone of this.milestoneDetails) {
          if (milestone.id == this.currentMilestone) {
            var milestoneReachAt = milestone.milestone_reach_at;
            var nextMilestoneReachAt = this.milestoneDetails[milestone.sequence].milestone_reach_at;
            var midValue = (milestoneReachAt + nextMilestoneReachAt) / 2;
            var firstFourth = (milestoneReachAt + midValue) / 2;
            var lastFourth = (midValue + nextMilestoneReachAt) / 2;
            var valueToMultiply = milestone.sequence - 1;
          }
        }

        if (isNaN(this.currentPurchaseValue)) {
          this.progressWidth = 0;
        } else {
          if (this.currentPurchaseValue == milestoneReachAt) {
            this.progressWidth = this.eachMilestone * valueToMultiply;
          } else if (this.currentPurchaseValue > milestoneReachAt && this.currentPurchaseValue <= firstFourth) {
            this.progressWidth = (this.eachMilestone * valueToMultiply) + ((this.eachMilestone * 25) / 100);
          } else if (this.currentPurchaseValue > firstFourth && this.currentPurchaseValue <= midValue) {
            this.progressWidth = (this.eachMilestone * valueToMultiply) + ((this.eachMilestone * 50) / 100);
          } else if (this.currentPurchaseValue > midValue && this.currentPurchaseValue < nextMilestoneReachAt) {
            this.progressWidth = (this.eachMilestone * valueToMultiply) + ((this.eachMilestone * 75) / 100);
          } else {
            this.progressWidth = 0;
          }
        }
      }
    }
  }

  addCustomer() {
    this.resetsearchCustomer();
    this.customer = null;
    this.isEdit = false;
    this.showAddBtn = false;
    this.showData = false;
    this.showMsg = false;
    this.cardTitle = 'Add New';
    this.showReg = !this.showReg;
  }

  closeEditPanel() {
    this.showReg = false;
    this.showAddBtn = true;
  }

  closeBranchPanel() {
    this.showBranch = false;
    // this.showAddBtn = true;
  }

  editCustomer(editCustomer: User) {
    this.closeBranchPanel();
    this.showReg = !this.showReg;
    this.showAddBtn = !this.showAddBtn;
    this.isEdit = true;
    this.cardTitle = 'Edit';
    this.user = editCustomer;
    this.customer = null;
    const element = document.querySelector('.scrollEditPanel');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      this.customer = null;
    }
  }
  onSubmit(data) {
    this.subscriptions.push(
      this.managecustomersservice
        .addCustomer(data)
        .subscribe(result => {
          if (result.data['statusCode'] === 105 || result.data.statusCode === 102) {
            const message = result.message;
            this.error = { message, ...result.data };
            return;
          }
          if (!result.data['statusCode']) {
            const userData = result.data;
            this.typesUtilsService.snackbarAlert(result.message, false, { horizontalPosition: 'right' });

            const findUser = {
              search_by_type: 'mobile_number',
              search_label: userData.mobile_number,
              search_by_value: userData.mobile_number,
              search_by_name: null,
              request_type: 1
            };

            if (this.searchCustomerComponent) {
              this.searchCustomerComponent.searchCustomers(findUser);
            }
            this.closeEditPanel();
          }
        }, error => {
          if (error.status === 422) {
            this.error = error.error.error.details || [];
          }
        })
    );

  }

  openCouponTab() {
    this.showCoupons = true;
  }

  openVouchersTab() {
    this.showCoupons = false;
  }

  selectedTabChange(value) {
    const tabIndex = value.index;
  }

  isChildComponentsDestroy(isDestroy: boolean) {
    this.error = [];
    this.isDestroy = isDestroy;
  }

  getGender(genderId: number = null): string {
    let gender = null;
    switch (genderId) {
      case 1:
        gender = 'Male';
        break;
      case 2:
        gender = 'Female';
        break;
      case 3:
        gender = 'Other';
        break;
    }
    return gender;
  }

  isUserActive(statusId: number = 0): boolean {
    return statusId === 1 || false;
  }

  getUserStatus(statusId: number): string {
    let status = 'Blocked';
    switch (statusId) {
      case 0:
        status = 'Inactive';
        break;
      case 1:
        status = 'Active';
        break;
      case 2:
        status = 'Deleted';
        break;
      case 3:
        status = 'Blocked';
        break;
    }
    return status;
  }

  getMaritalStatus(statusId: number): string {
    let status = null;
    switch (statusId) {
      case 1:
        status = 'Single';
        break;
      case 2:
        status = 'Married';
        break;
      case 3:
        status = 'Widow';
        break;
    }
    return status;
  }

  getFullName(customer: User) {
    return `${customer.first_name} ${customer.last_name || ''}`;
  }

  canEdit(user: User) {
    if (user.sub_merchant_id)
      return user.sub_merchant_id === this.authService.currentUser.sub_merchant_id;
    else
      return true;
  }

  isPosUser(): boolean {
    if (this.authService.loggedIn) {
      return this.authService.currentUser.user_type_id === 5;
    }
    return false;
  }

  sendVerify(custDetails: any) {
    this.managecustomersservice.verifyEmail(custDetails).subscribe(res => {
      if (res) {
        this.authService.swalFireFunction('Email Verify', res.message, 'success');
      }
    }, err => {
      // console.log(err);
    });
  }

  onSelected(data: SelectedData) {
    if (data.action === 'edit') {
      this.customer = null;
      this.showReg = !this.showReg;
      this.showAddBtn = !this.showAddBtn;
      this.isEdit = true;
      this.cardTitle = 'Edit';
      this.user = data.user;
    } else if (data.action === 'view') {
      this.customer = null;
      const mobile = data.user.mobile_number;
      const formValues = {
        search_by_type: 'mobile_number',
        search_label: mobile,
        search_by_value: mobile,
        search_by_name: null,
        request_type: 1
      };

      // this.searchCustomerComponent.searchCustomers(formValues);
      this.closeEditPanel();
      this.manageCustomerService.searchCustomer(formValues).subscribe(
        result => {
          this.getCustomer(result);
        },
        error => {
          console.log(error);
          if (error.status === 422) {
            //return this.setError('Please select customer from search result');
          }
        }
      );
      const element = document.querySelector('#scrollViewPanel');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }
    }
  }

  homeBranchChangeList(value: boolean){
    this.homeBranchChangeFlag = value;
  }

  loadMobileChangeList(value:boolean){
    this.mobileChangeFlag = value;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
