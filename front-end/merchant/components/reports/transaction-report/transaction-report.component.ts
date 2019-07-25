import { Component, OnInit, ViewChild, OnChanges, DoCheck } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { merge, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { QueryParamsModel } from 'src/app/shared/models/query-models/query-params.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportsService } from '../reports.service';
import { TransactionReportsDatasource } from '../datasource/transaction-reports.datasource';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DateConstant } from 'src/app/shared/components/constant/date-constant';

@Component({
  selector: 'app-transaction-report',
  templateUrl: './transaction-report.component.html',
  styleUrls: ['./transaction-report.component.scss']
})
export class TransactionReportComponent implements OnInit {
  displayedColumns: string[] = [
    'customer_name',
    'mobile_number',
    'order_number',
    'order_date',
    'calculated_amount',
    'location_name'
  ];

  dataSource: TransactionReportsDatasource;
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
  formControls: any;
  downloadedData: any[];
  subscriptions: Subscription[] = [];
  typesUtilsService: any;
  filterDataSource: any;
  totalCount: number;
  totalAmount: number;
  avgAmount: number;
  maxAmount: number;
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

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadTransactionList();
        })
      )
      .subscribe();
    const queryParams = new QueryParamsModel(this.filterConfiguration(true));
    queryParams.sortField = 'order_date';
    queryParams.sortOrder = 'desc';
    this.dataSource = new TransactionReportsDatasource(this.reportService);
    this.dataSource.loadTransactionList(queryParams);
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
    this.formControls = 'trans_report';
  }

  ngOnChanges() {
    this.loadTransactionList();
  }

  loadTransactionList() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(true),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    this.dataSource.loadTransactionList(queryParams);
  }

  filter() {
    this.paginator.pageIndex = 0;
    this.loadTransactionList();
  }

  filterConfiguration(isGeneralSearch: boolean = true): any {
    const filter: any = {};
    if (!isGeneralSearch) {
      return filter;
    }
    if (this.exportType) {
      filter['exportType'] = this.exportType;
      filter['reportName'] = 'Transaction_report_' + (new Date().getTime());

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
    this.loadTransactionList();
  }

  togglePanelSearch() {
    this.panelStateSearch = !this.panelStateSearch;
  }

  onSubmit(data) {
    this.filterDataSource = data;
    this.paginator.pageIndex = 0;
    this.loadTransactionList();
  }

  getSnapshot() {
    this.reportService.getTransactionSnapshot().subscribe(res => {
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
    this.loadTransactionList();
    this.exportType = null;
  }
}
