import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { QueryParamsModel } from 'src/app/shared/models/query-models/query-params.model';
import { ManageCustomersListDatasource } from './manage-customer-list.datasource';
import { ManageCustomerListService } from './manage-customer-list.service';
import { User } from 'src/app/customer/models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateConstant } from 'src/app/shared/components/constant/date-constant';

@Component({
  selector: 'app-manage-customers-list',
  templateUrl: './manage-customers-list.component.html',
  styleUrls: ['./manage-customers-list.component.scss']
})
export class ManageCustomersListComponent implements OnInit {
  displayedColumns: string[] = [
    'customer_name',
    'mobile_number',
    'email',
    'gender',
    'current_purchase_value',
    'created_at',
    'actions'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output('selected') userSelected = new EventEmitter<object>();
  subscriptions: Subscription[] = [];
  filterDataSource: any;
  dataSource: ManageCustomersListDatasource;
  userResult: any[];
  panelState: boolean;
  searchCustomerForm: FormGroup;
  panelStateSearch: any;
  dateFormate: any;
  constructor(
    private manageCustomerService: ManageCustomerListService,
    private _formBuilder: FormBuilder
    
  ) { }

  ngOnInit() {

    // Date formate as 'dd MMM yyyy'
    this.dateFormate = DateConstant.dateFormate;
    
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadManageCustomerList();
        })
      )
      .subscribe();

    const queryParams = new QueryParamsModel(this.filterConfiguration(true));
    queryParams.sortField = 'created_at';
    queryParams.sortOrder = 'desc';
    this.dataSource = new ManageCustomersListDatasource(this.manageCustomerService);
    //First load
    this.dataSource.loadCustomerListLogs(queryParams);
    this.dataSource.entitySubject.subscribe(res => {
      this.userResult = res;
    });
    this.searchCustomerForm = this.createForm();
  }

  createForm(){
    return this._formBuilder.group({
      customer_name: [null],
      mobile_number: ['', Validators.pattern('[6-9](?!00000000)\\d{9}')]
      // mobile_number: ['', Validators.pattern(/^[0-9](?!00000000)\d{9}$/)]
    });
  }

  loadManageCustomerList() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(true),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize,

    );
    this.dataSource.loadCustomerListLogs(queryParams);
  }

  filterConfiguration(filterDataSource: any, isGeneralSearch: boolean = true): any {
    const filter: any = {};
    for (const field in this.filterDataSource) {
      const formControl = this.filterDataSource[field];
      if (formControl) {
        filter[field] = formControl;
      }
    }
    return filter;
  }

  editUser(user: User) {
    if(this.panelStateSearch) {
      this.panelStateSearch = !this.panelStateSearch;
    }
    this.userSelected.emit({ user: user, action: 'edit' });
  }

  viewUser(user: User) {
    if(this.panelStateSearch) {
      this.panelStateSearch = !this.panelStateSearch;
    }
    this.userSelected.emit({ user: user, action: 'view' });
  }

  closePanel() {
    this.panelState = !this.panelState;
  }

  togglePanelSearch() {
    this.panelStateSearch = !this.panelStateSearch;
    this.searchCustomerForm.reset();
    this.userSelected.emit({});
  }

  closeSearchPanel() {
   
    this.panelStateSearch = !this.panelStateSearch;
    this.searchCustomerForm.reset();
    this.filterDataSource = [];
    this.loadManageCustomerList();
  }

  togglePanel() {
    this.panelState = !this.panelState;
    if (this.panelStateSearch) {
      this.panelStateSearch = !this.panelStateSearch;
    }
  }

  filterCustomer(data){
    this.filterDataSource = data;
    this.paginator.pageIndex = 0;
    this.loadManageCustomerList();
  }

  filterReset() {
    this.filterDataSource = [];
    this.searchCustomerForm.reset();
    this.loadManageCustomerList();
  }
}
