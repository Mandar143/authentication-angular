import { Component, OnDestroy, OnInit, ViewChild, Input, OnChanges, DoCheck } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { merge, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SharedService } from 'src/app/shared/services/shared.service';
import { TypesUtilsService } from 'src/app/shared/services/types-utils.service';
import { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import { QueryParamsModel } from '../../../../shared/models/query-models/query-params.model';
import { GetHomeBranchChangeRequestsDataSource } from './get-home-branch-change-requests.datasource';
import { GetHomeBranchChangeRequestsService } from './get-home-change-requests.service';
import { User } from 'src/app/customer/models/user.model';
import { DateConstant } from 'src/app/shared/components/constant/date-constant';

@Component({
  selector: 'app-get-home-branch-change-requests',
  templateUrl: './get-home-branch-change-requests.component.html',
  styleUrls: ['./get-home-branch-change-requests.component.scss'],
  providers: [SharedService]
})
export class GetHomeBranchChangeRequestsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'customer_name',
    'existing_home_branch_id',
    'new_home_branch_id',
    'requested_by_name',
    'updated_by_name',
    'created_at',
    'updated_at',
    'status',
    'actions'
  ];
  // dataSource: any;
  userResult: any;
  panelState: boolean;
  dataSource: GetHomeBranchChangeRequestsDataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() user: User;
  @Input() updateList: boolean;
  subscriptions: Subscription[] = [];
  formControls: any;
  panelStateSearch: boolean;
  filterDataSource: any;
  alertParams: SweetAlertOptions = {
    title: 'Confirm',
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'
  };
  isUserSearch: boolean;
  requestType = { request_type: 3 };
  dateFormate: any;
  constructor(
    private getHomeBranchChangeRequestsService: GetHomeBranchChangeRequestsService,
    private typesUtilsService: TypesUtilsService,
    private sharedService: SharedService) { }

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
          this.loadHomeBranchChangeList();
        })
      )
      .subscribe();

    const queryParams = new QueryParamsModel(this.filterConfiguration(true));
    queryParams.sortField = 'created_at';
    queryParams.sortOrder = 'desc';
    this.dataSource = new GetHomeBranchChangeRequestsDataSource(this.getHomeBranchChangeRequestsService);
    // First load

    this.dataSource.loadHomeBranchChangeLogs(queryParams);
    this.dataSource.entitySubject.subscribe(res => this.userResult = res);
    this.formControls = 'home_branch_change';
  }

  loadHomeBranchChangeList() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(true),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize,
    );

    this.dataSource.loadHomeBranchChangeLogs(queryParams);
  }

  togglePanelSearch() {
    this.panelStateSearch = !this.panelStateSearch;
  }

  closeEditPanel() {
    this.panelStateSearch = false;
  }

  filterConfiguration(isGeneralSearch: boolean = true): any {
    const filter: any = {};
    if (!isGeneralSearch) {
      return filter;
    }

    for (const field in this.filterDataSource) {
      if (field) {
        const formControl = this.filterDataSource[field];
        if (formControl) {
          filter[field] = formControl;
        }
      }
    }

    if (this.user) {
      filter['mobile_number'] = this.user.mobile_number;
    }
    return filter;
  }

  onSubmit(data) {
    this.filterDataSource = data;
    this.paginator.pageIndex = 0;
    this.loadHomeBranchChangeList();
  }

  setAlert(params: SweetAlertOptions) {
    return this.typesUtilsService.sweetAlert(params);
  }

  cancelRequest(request) {
    this.setAlert({
      ...this.alertParams,
      text: 'Do you want to cancel this request?',
    }).then(result => this.handleCancelRequest(result, request));
  }

  approveRequest(request) {
    this.setAlert({
      ...this.alertParams,
      text: 'Do you want to approve this request?'
    }).then(result => this.handleApproveRequest(result, request));
  }

  handleCancelRequest(result: SweetAlertResult, data: any) {
    if (result.value) {
      this.subscriptions.push(this.sharedService.changeRequestStatus({
        'id': data.id,
        'customer_loyalty_id': data.customer_loyalty_id,
        'status': 3,
        ...this.requestType
      }).subscribe(res => this.setAlert(res.data).then(alertResult => this.loadHomeBranchChangeList())
      ));
    }
  }

  handleApproveRequest(result: SweetAlertResult, element: any) {
    if (result.value) {
      this.subscriptions.push(this.sharedService.changeRequestStatus({
        'id': element.id,
        'customer_loyalty_id': element.customer_loyalty_id,
        'change_for': 1,
        'status': 2,
        ...this.requestType
      }).subscribe(
        res => this.setAlert(res.data).then(alertResult => this.loadHomeBranchChangeList())
      ));
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
