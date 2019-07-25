import { Component, OnInit, Input, SimpleChanges, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { CustomerTransactionsService } from './customer-transactions.service';
import { tap } from 'rxjs/operators';
import { merge, Subscription } from 'rxjs';
import { QueryParamsModel } from '../../../../../../shared/models/query-models/query-params.model';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { CustomerTransactionsDataSource } from './customer-transactions.datasource';
import { MatSort, MatPaginator, MatDialog } from '@angular/material';
import { User } from 'src/app/customer/models/user.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TypesUtilsService } from 'src/app/shared/services/types-utils.service';
import { OrderDetailsLogComponent } from './order-details-log/order-details-log.component';
import { CapsLettersPipe } from 'src/app/shared/pipes/caps-letters.pipe';
import { DateConstant } from 'src/app/shared/components/constant/date-constant';


export interface Status {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-customer-transactions',
  templateUrl: './customer-transactions.component.html',
  styleUrls: ['./customer-transactions.component.scss'],
  providers: [CapsLettersPipe]
})
export class CustomerTransactionsComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  displayedColumns: string[] = [
    'order_number',
    'order_date',
    'calculated_amount',
    'store_code',
    'total_items',
    'order_status',
    'Action'
  ];
  // dataSource: any;
  transactionList: any;
  mobile_number: any;
  @Input() user: User;

  panelState: Boolean = false;
  dataSource: CustomerTransactionsDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  subscriptions: Subscription[] = [];
  swal = Swal;
  formControls: any;
  panelStateSearch: Boolean = false;
  filterDataSource: any;

  status: Status[] = [
    { value: '0', viewValue: 'All' },
    { value: '1', viewValue: 'Ordered' },
    { value: '4', viewValue: 'Returned' }
  ];
  dateFormate: any;

  constructor(
    private _formBuilder: FormBuilder,
    private customerTransactionsService: CustomerTransactionsService,
    private typeUtilsService: TypesUtilsService,
    public dialog: MatDialog,
  ) { }


  ngOnInit() {

    // Date formate as 'dd MMM yyyy'
    this.dateFormate = DateConstant.dateFormate;
    this.createSearchForm();

    const orderStatus = this.searchForm.get('order_status');
    orderStatus.setValue("0");
    orderStatus.updateValueAndValidity();

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadTransactionList();
        })
      )
      .subscribe();

    const queryParams = new QueryParamsModel(this.filterConfiguration(true));
    this.dataSource = new CustomerTransactionsDataSource(this.customerTransactionsService);
    // First load

    this.dataSource.loadTransactionLogs(queryParams);
    this.dataSource.entitySubject.subscribe(res => {
      this.transactionList = res;
    });
  }

  loadTransactionList() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(true),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize,
    );
    // console.log(queryParams);
    this.dataSource.loadTransactionLogs(queryParams);
  }

  togglePanelSearch() {
    this.panelStateSearch = !this.panelStateSearch;
  }

  transFormDate(date: Date) {
    return this.typeUtilsService.transformDate(date, 'dd/MM/yyyy hh:mm a');
  }

  filterConfiguration(isGeneralSearch: boolean = true): any {

    const filter: any = {
      mobile_number: this.user.mobile_number
    };

    if (!isGeneralSearch) {
      return filter;
    }

    const formValues = this.searchForm.value;
    if (formValues["order_status"] == 0) {
      delete formValues["order_status"];
    }
    for (const field in formValues) {
      if (formValues[field]) {

        filter[field] = formValues[field];
      }
    }
    //console.log(filter);

    return filter;
  }

  createSearchForm() {
    this.searchForm = this._formBuilder.group({
      order_status: [null]
    });
  }

  viewOrderItems(items) {
    //console.log(items);
    const dialogRef = this.dialog.open(OrderDetailsLogComponent, {
      autoFocus: true,
      disableClose: true,
      width: '800px',
      panelClass: 'delete-dialog',
      data: items
    });
    dialogRef.afterClosed().subscribe(res => {
      //console.log(res);
      if (!res) {
        return;
      }
      else {

      }


    });
  }


  filterReset() {
    this.searchForm.reset();
    this.loadTransactionList();
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
