import { Component, OnInit, ViewChild } from '@angular/core';
import { FeedbackService } from '../feedback.service';
import { MatSort, MatPaginator, MatDialog } from '@angular/material';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QueryParamsModel } from 'src/app/shared/models/query-models/query-params.model';
import { FeedbackListDataSource } from './feedback-list.datasource';
import { FeedbackDetailsComponent } from '../feedback-details/feedback-details.component';
import { DateConstant } from 'src/app/shared/components/constant/date-constant';

@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.scss'],
  providers: [FeedbackService]
})
export class FeedbackListComponent implements OnInit {
  searchForm: FormGroup;
  displayedColumns: string[] = [
    'customer_name',
    'mobile_number',
    'subject',
    'created_at',
    'view'
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filterFormGroup: any;
  dataSource: FeedbackListDataSource;
  panelStateSearch: boolean;
  filterDataSource: any;
  resultList = [];
  formControls: string;
  totalCount: number;
  totalCustomer: number;
  avgAmount: number;
  maxAmount: number;
  dateFormate: any;

  constructor(
    private _formBuilder: FormBuilder,
    private feedbackSerice: FeedbackService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    // Date formate as 'dd MMM yyyy'
    this.dateFormate = DateConstant.dateFormate;
    
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadList();
        })
      )
      .subscribe();

    // this.filterFormGroup = this.createFilterForm();
    // Init DataSource
    const queryParams = new QueryParamsModel(this.filterConfiguration(true));
    queryParams.sortField = 'created_at';
    queryParams.sortOrder = 'desc'; // sort by createdAt
    this.dataSource = new FeedbackListDataSource(this.feedbackSerice);
    // First load
    this.dataSource.loadListFromServer(queryParams);
    this.dataSource.entitySubject.subscribe(res => (this.resultList = res));
    this.formControls = 'feedback-list';
    this.getSnapshot();
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

  filter() {
    this.paginator.pageIndex = 0;
    this.loadList();
  }

  filterConfiguration(isGeneralSearch: boolean): any {
    const filter: any = {
    };
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
    return filter;
  }

  createFilterForm(): any {
    return this._formBuilder.group({
    });
  }

  togglePanelSearch() {
    this.panelStateSearch = !this.panelStateSearch;
  }

  onSubmit(data) {
    this.filterDataSource = data;
    this.paginator.pageIndex = 0;
    this.loadList();
  }

  view(data) {
    const dialogRef = this.dialog.open(FeedbackDetailsComponent, {
      autoFocus: true,
      disableClose: true,
      width: '500px',
      panelClass: 'delete-dialog',
      data: data
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      } else { }
    });
  }

  getSnapshot() {
    this.feedbackSerice.getSnapshot().subscribe(res => {
      const snapshotData = res.data;
      this.totalCount = snapshotData.total;
      this.totalCustomer = snapshotData.total_customer;
      /* this.avgAmount = snapshotData.avg_amount;
      this.maxAmount = snapshotData.max_amount; */
    }, err => {
      console.log(err);
    })
  }
}
