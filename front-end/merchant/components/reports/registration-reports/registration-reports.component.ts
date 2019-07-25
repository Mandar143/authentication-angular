import { Component, OnInit, ViewChild } from '@angular/core';
import { RegistrationReportsDatasource } from '../datasource/registration-reports.datasource';
import { MatPaginator, MatSort } from '@angular/material';
import { ReportsService } from '../reports.service';
import { ActivatedRoute } from '@angular/router';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { QueryParamsModel } from 'src/app/shared/models/query-models/query-params.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DateConstant } from 'src/app/shared/components/constant/date-constant';

@Component({
  selector: 'app-registration-reports',
  templateUrl: './registration-reports.component.html',
  styleUrls: ['./registration-reports.component.scss']
})
export class RegistrationReportsComponent implements OnInit {
  searchForm: FormGroup;
  displayedColumns: string[] = [
    'customer_name',
    'mobile_number',
    'current_purchase_value',
    'lifetime_purchases',
    'location_name',
    'created_at'
  ];

  dataSource: RegistrationReportsDatasource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public menuInfo: Array<any> = [];
  errorMessage: any[];
  columns: { header: string, row: any };
  data: any[];
  registrationResult: any[];
  queryParams: any;
  routerLink: any;
  globalRouterLink: any;
  panelStateSearch: boolean;
  typesUtilsService: any;
  formControls: any;
  filterDataSource: any;
  totalCount: number;
  totalPurchase: number;
  avgPurchase: number;
  maxPurchase: number;
  dateFormate: any;
  exportType: number;
  disableStatus: boolean;
  // downloadCSVButton: boolean = true;
  constructor(
    private _formBuilder: FormBuilder,
    private reportService: ReportsService,
    private routeParams: ActivatedRoute
  ) { }

  ngOnInit() {
    // Date formate as 'dd MMM yyyy'
    this.dateFormate = DateConstant.dateFormate;

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadRegistration();
        })
      )
      .subscribe();
    const queryParams = new QueryParamsModel(this.filterConfiguration(true));
    queryParams.sortField = 'created_at';
    queryParams.sortOrder = 'desc'; // sort by createdAt
    this.dataSource = new RegistrationReportsDatasource(this.reportService);
    this.dataSource.loadRegistration(queryParams);
    this.dataSource.entitySubject.subscribe(res => {
      this.registrationResult = res;
      if (!this.registrationResult.length) {
        this.disableStatus = true;
      } else {
        this.disableStatus = false;
      }
    });
    this.getSnapshot();
    this.formControls = 'registration-reports';
  }

  /*  ngOnChanges() {
     this.loadRegistration();
   } */

  loadRegistration() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(true),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize,
    );
    this.dataSource.loadRegistration(queryParams);
  }

  filter() {
    this.paginator.pageIndex = 0;
    this.loadRegistration();
  }

  filterConfiguration(isGeneralSearch: boolean = true): any {
    const filter: any = {};
    if (!isGeneralSearch) {
      return filter;
    }
    if (this.exportType) {
      filter['exportType'] = this.exportType;
      filter['reportName'] = 'Registration_report_' + (new Date().getTime());

    }
    //  const formValues = this.searchForm.value;
    for (const field in this.filterDataSource) {
      if (field) {
        const formControl = this.filterDataSource[field];
        if (formControl) {
          filter[field] = formControl;
        }
      }
    }
    return filter;
  }

  filterReset() {
    this.loadRegistration();
  }

  togglePanelSearch() {
    this.panelStateSearch = !this.panelStateSearch;

  }
  onSubmit(data) {
    this.filterDataSource = data;
    this.paginator.pageIndex = 0;
    this.loadRegistration();
  }

  getSnapshot() {
    this.reportService.getCustomerRegistrationSnapshot().subscribe(res => {
      const snapshotData = res.data;
      this.totalCount = snapshotData.total;
      this.totalPurchase = snapshotData.total_purchase;
      this.avgPurchase = snapshotData.avg_purchase;
      this.maxPurchase = snapshotData.max_purchase;
    }, err => {
      console.log(err);
    })
  }
  emailReport(reportType: number) {
    this.exportType = reportType;
    this.loadRegistration();
    this.exportType = null;
  }
}
