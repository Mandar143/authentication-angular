import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { merge, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { QueryParamsModel } from 'src/app/shared/models/query-models/query-params.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportsService } from '../reports.service';
import { VoucherReportsDatasource } from '../datasource/voucher-reports.datasource';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DateConstant } from 'src/app/shared/components/constant/date-constant';
@Component({
  selector: 'app-voucher-reports',
  templateUrl: './voucher-reports.component.html',
  styleUrls: ['./voucher-reports.component.scss']
})
export class VoucherReportsComponent implements OnInit {
  searchForm: FormGroup;
  displayedColumns: string[] = [
    'customer_name',
    'mobile_number',
    'voucher_name',
    'voucher_code',
    'order_number',
    'order_date',
    'location_name'
  ];

  dataSource: VoucherReportsDatasource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public menuInfo: Array<any> = [];
  errorMessage: any[];
  columns: { header: string, row: any };
  data: any[];
  userResult: any[];
  queryParams: any;
  routerLink: any;
  globalRouterLink: any;
  panelStateSearch: boolean;
  downloadedData: any[];
  subscriptions: Subscription[] = [];
  typesUtilsService: any;
  formControls: any;
  filterDataSource: any;
  totalCount: number;
  totalAmount: number;
  avgAmount: number;
  maxAmount: number;
  dateFormate: any;
  exportType: number;
  disableStatus: boolean;
  constructor(
    private _formBuilder: FormBuilder,
    private reportService: ReportsService,
    private routeParams: ActivatedRoute
  ) { }

  ngOnInit() {
    // Date formate as 'dd MMM yyyy'
    this.dateFormate = DateConstant.dateFormate;

    // this.createForm();
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadVoucherList();
        })
      )
      .subscribe();
    const queryParams = new QueryParamsModel(this.filterConfiguration(true));
    queryParams.sortField = 'order_date';
    queryParams.sortOrder = 'desc';
    this.dataSource = new VoucherReportsDatasource(this.reportService);
    this.dataSource.loadVoucherList(queryParams);
    this.dataSource.entitySubject.subscribe(res => {
      this.userResult = res;
      if (!this.userResult.length) {
        this.disableStatus = true;
      } else {
        this.disableStatus = false;
      }
    });

    /* this.subscriptions.push(this.reportService.downloadCSV().subscribe(res => {
      this.downloadedData = res;
    })
    ); */
    this.getSnapshot();
    this.formControls = 'voucher-reports';
  }

  ngOnChanges() {
    this.loadVoucherList();
  }

  loadVoucherList() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(true),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize,
    );

    this.dataSource.loadVoucherList(queryParams);

  }

  filter() {
    this.paginator.pageIndex = 0;
    this.loadVoucherList();
  }

  filterConfiguration(isGeneralSearch: boolean = true): any {
    const filter: any = {};
    if (!isGeneralSearch) {
      return filter;
    }
    if (this.exportType) {
      filter['exportType'] = this.exportType;
      filter['reportName'] = 'Voucher_report_' + (new Date().getTime());

    }
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

  /* downloadCSV() {
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(this.downloadedData[0]);
    let csv = this.downloadedData.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');

    var a = document.createElement('a');
    var blob = new Blob([csvArray], { type: 'text/csv' }),
      url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = "Voucher-Reports.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  } */

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  filterReset() {
    this.loadVoucherList();
  }

  togglePanelSearch() {
    this.panelStateSearch = !this.panelStateSearch;
  }

  onSubmit(data) {
    this.filterDataSource = data;
    this.paginator.pageIndex = 0;
    this.loadVoucherList();
  }

  getSnapshot() {
    this.reportService.getVoucherRedemptionSnapshot().subscribe(res => {
      const snapshotData = res.data;
      this.totalCount = snapshotData.total;
      this.totalAmount = snapshotData.total_amount;
      this.avgAmount = snapshotData.avg_amount;
      this.maxAmount = snapshotData.max_amount;
    }, err => {
      console.log(err);
    })
  }
  emailReport(reportType: number) {
    this.exportType = reportType;
    this.loadVoucherList();
    this.exportType = null;
  }
}
