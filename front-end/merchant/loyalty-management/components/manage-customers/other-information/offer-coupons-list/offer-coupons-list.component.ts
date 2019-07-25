import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { QueryParamsModel } from 'src/app/shared/models/query-models/query-params.model';
import { OfferCouponsDataSource } from './offer-coupons-datasource';
import { OfferCouponsService } from './offer-coupons.service';
import { User } from 'src/app/customer/models/user.model';
import { CustomerService } from 'src/app/services/customer.service';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { UserService } from 'src/app/services/user.service';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { VerifyOptComponent } from 'src/app/shared/components/verify-opt/verify-opt.component';
import { TypesUtilsService } from 'src/app/shared/services/types-utils.service';
import { DateConstant } from 'src/app/shared/components/constant/date-constant';
@Component({
  selector: 'app-offer-coupons-list',
  templateUrl: './offer-coupons-list.component.html',
  styleUrls: ['./offer-coupons-list.component.scss']
})
export class OfferCouponsListComponent implements OnInit {
  filterFormGroup: FormGroup;
  dataSource: OfferCouponsDataSource;
  resultList = [];
  @Input() user: User;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = [
    'milestone_id',
    'voucher_value',
    'voucher_code'
  ];

  milestoneNames = { '1': 'First', '2': 'Second', '3': 'Third', '4': 'Fourth', '5': 'Fifth', '6': 'Sixth', '7': 'Seventh' };
  dateFormate: any;

  constructor(
    private _formBuilder: FormBuilder,
    private OfferCouponsService: OfferCouponsService,
    private customerService: CustomerService,
    private auth: AuthService,
    private userService: UserService,
    private dialog: MatDialog,
    private typesUtilsService: TypesUtilsService
  ) { }

  ngOnInit() {
    // Date formate as 'dd MMM yyyy'
    this.dateFormate = DateConstant.dateFormate;
    
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadList();
        })
      )
      .subscribe();

    this.filterFormGroup = this.createFilterForm();
    // Init DataSource
    const queryParams = new QueryParamsModel(this.filterConfiguration(true));
    queryParams.sortField = 'coupon_used';
    // queryParams.sortOrder = 'desc';
    this.dataSource = new OfferCouponsDataSource(this.OfferCouponsService);
    // First load
    this.dataSource.loadListFromServer(queryParams);
    this.dataSource.entitySubject.subscribe(res => (this.resultList = res));
  }

  loadList() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(true),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );

    this.dataSource.loadListFromServer(queryParams);

  }

  filterConfiguration(isGeneralSearch: boolean = true): any {
    const filter: any = {
      customer_loyalty_id: this.user.customer_loyalty_id
    };
    if (!isGeneralSearch) {
      return filter;
    }
    const formValues = this.filterFormGroup.value;
    for (const field in formValues) {
      if (formValues[field]) {
        filter[field] = formValues[field];
      }
    }
    return filter;
  }

  createFilterForm() {
    return this._formBuilder.group({
    });
  }

  getCode(code) {
    if (this.user.mobile_number) {
      code['type'] = 2;
      code['mobile_number'] = this.user.mobile_number;
      this.customerService.updateCoupans(code).subscribe(response => {
        this.setAlert({
          type: 'success',
          text: response.message,
          showCancelButton: true,
        })
      });
    }

    /* Swal.fire({ title: message, showCancelButton: true, showCloseButton: true }).then(result => {
      if (result.value) {
        if (this.user.mobile_number) {
          const data={
            'mobile_number':this.user.mobile_number
          }
          const requestParam = { "mobile_number": this.user.mobile_number }
          this.userService.requestOtp(requestParam).subscribe(result => {
            //this.spinner.active = false;
            const dialogData = { ...result.data, ...code,...data,...this.user };
            this.callDialog(dialogData);
          }, error => {
            console.log(error);
          });

        }
      }
    }) */
  }

  callDialog(data) {
    const dialogRef = this.dialog.open(VerifyOptComponent, {
      autoFocus: true,
      disableClose: true,
      maxWidth: '380px',
      panelClass: 'verify-otp-panel',
      data: data
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      } else {
        this.customerService.updateCoupans(res).subscribe(response => {
          console.log(response);
        });
        //this.isRequested = true;
      }
    });
  }

  setAlert(params: SweetAlertOptions) {
    return this.typesUtilsService.sweetAlert(params);
  }
}
