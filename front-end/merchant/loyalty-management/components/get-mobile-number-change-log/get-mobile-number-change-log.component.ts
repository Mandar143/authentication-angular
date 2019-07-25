import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { merge, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from 'src/app/customer/models/user.model';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { MobileNumberChangeService } from '../../../../shared/components/mobile-number-change/mobile-number-change.service';
import { QueryParamsModel } from '../../../../shared/models/query-models/query-params.model';
import { GetMobileNumberChangeLogDataSource } from './get-mobile-number-change-log.datasource';
import { GetMobileNumberChangeLogService } from './get-mobile-number-change-log.service';
import { DateConstant } from 'src/app/shared/components/constant/date-constant';


@Component({
  selector: 'app-get-mobile-number-change-log',
  templateUrl: './get-mobile-number-change-log.component.html',
  styleUrls: ['./get-mobile-number-change-log.component.scss']
})
export class GetMobileNumberChangeLogComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'customer_name',
    'existing_mobile_number',
    'new_mobile_number',
    'requested_by_name',
    'updated_by_name',
    'created_at',
    'updated_at',
    'status'
  ];
  // dataSource: any;
  panelStateSearch: boolean;
  dataSource: GetMobileNumberChangeLogDataSource;
  subscriptions: Subscription[] = [];
  formControls: any;
  filterDataSource: any;
  userResult: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() user: User;
  isUserSearch: boolean;
  dateFormate: any;
  constructor(
    private getMobileNumberChangeLogService: GetMobileNumberChangeLogService,
    private mobileNumberChangeService: MobileNumberChangeService
  ) { }

  ngOnInit() {

    // Date formate as 'dd MMM yyyy'
    this.dateFormate = DateConstant.dateFormate;
    
    if (this.user) {
      this.displayedColumns.splice(0, 1);
      this.displayedColumns.splice(-1, 1);
      this.isUserSearch = true;
    }
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadMobileNumberChangeList();
        })
      )
      .subscribe();

    const queryParams = new QueryParamsModel(this.filterConfiguration(true));
    queryParams.sortField = 'created_at';
    queryParams.sortOrder = 'desc';
    this.dataSource = new GetMobileNumberChangeLogDataSource(this.getMobileNumberChangeLogService);
    // First load
    this.dataSource.loadMobileNumberChangeLogs(queryParams);
    this.dataSource.entitySubject.subscribe(res => {
      this.userResult = res;
    });

    this.formControls = 'mobile_change';
  }


  /* ngOnChanges() {
    this.loadMobileNumberChangeList();
  } */

  loadMobileNumberChangeList() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(true),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize,

    );
    this.dataSource.loadMobileNumberChangeLogs(queryParams);
  }

  togglePanelSearch() {
    this.panelStateSearch = !this.panelStateSearch;
  }
  closeEditPanel() {
    this.panelStateSearch = false;
  }

  filterConfiguration(filterDataSource: any, isGeneralSearch: boolean = true): any {
    const filter: any = {};
    for (const field in this.filterDataSource) {
      if (this.filterDataSource[field]) {
        const formControl = this.filterDataSource[field];
        if (formControl) {
          filter[field] = formControl;
        }
      }
    }

    if (this.user) {
      filter['existing_mobile_number'] = this.user.mobile_number;
    }

    return filter;
  }


  onSubmit(data) {
    this.filterDataSource = data;
    this.paginator.pageIndex = 0;
    this.loadMobileNumberChangeList();
  }

  cancelRequest(element) {
    Swal.fire({
      title: 'Confirm',
      text: 'Do you want to cancel this request?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3da5da',
      cancelButtonColor: '#26253c',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(result => this.sweetaletCancel(result, element));
  }

  sweetaletCancel(result: SweetAlertResult, element: any) {
    if (result.value) {
      const sendData = {
        'id': element.id,
        'customer_loyalty_id': element.customer_loyalty_id,
        'change_for': 2,
        'status': 3,
        'changed_from': 1, // 1 for pos 2 for customer
        'request_type': 2  // 2 for mobile-number change, 3 for home-branch change
      };

      this.subscriptions.push(this.mobileNumberChangeService.changeRequestStatus(sendData).subscribe(
        result => {
          Swal.fire('Success', 'Request cancelled successfully', 'success');
          this.loadMobileNumberChangeList();
        }, err => {
          console.log(err);
        }
      )
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}


