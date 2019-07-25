import { Component, OnInit, Input, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs/typings';
import { MatButtonToggleChange, MatButtonToggleGroup } from '@angular/material';
import { AnalyticsFilter } from '../../analytics-filter';
import { Subscription } from 'rxjs';
import { MerchantDashboardService } from '../../merchant-dashboard.service';

@Component({
  selector: 'app-analytics-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit, AfterViewInit, OnDestroy {

  protected _selectedTabIndex = 0;
  protected _selectedTabType: string;
  protected _selectedSubFilter: string;
  protected _filterParent: AnalyticsFilter;
  private _initCounter = 1;
  subscriptions: Subscription[] = [];

  @Input() set setFilter(filter: AnalyticsFilter) {

    this._filterParent = filter;
    this._selectedTabType = this.getTabType(this._selectedTabIndex);
    if (this._initCounter > 1) {
      this.initTabValues(this.initChartType());
    }
    ++this._initCounter;
  }

  @Input() userType: number;
  @ViewChild('sale_average_transaction_per_customer') sale_average_transaction_per_customer: MatButtonToggleGroup;
  @ViewChild('sale_weekend_weekdays_details') sale_weekend_weekdays_details: MatButtonToggleGroup;

  average_trans = [];
  highOrder_details = [];
  average_transaction_per_customer = [];
  weekend_weekdays_details = [];
  chart_size = [850, 400];
  subFilterValue: string;

  colorScheme = {
    domain: ['#5AA454']
  };

  constructor(private merchantDashboardService: MerchantDashboardService) { }

  ngOnInit() {
    this.initTabIndex();
  }

  initTabList() {
    return [
      'average_trans',
      'highOrder_details',
      'average_transaction_per_customer',
      'weekend_weekdays_details'
    ];
  }

  getTabType(index: number) {
    const tabList = this.initTabList();
    return tabList[index] || null;
  }

  initTabIndex(): void {
    if (!this._selectedTabIndex) {
      this._selectedTabIndex = 0;
      this._selectedTabType = this.getTabType(this._selectedTabIndex);
    }
  }

  focusChange(event: MatTabChangeEvent): void {
    this._selectedTabIndex = event.index;
    this._selectedTabType = this.getTabType(event.index);
    this.initTabValues(this.initChartType());
  }

  subFilter(event: MatButtonToggleChange): void {
    this.subFilterValue = event.value;
    this._selectedSubFilter = event.value;
    this.initTabValues(this.initChartType());
  }

  ngAfterViewInit(): void {
    this.initTabValues(this.initChartType());
  }

  getDashboardDetails(filter: AnalyticsFilter) {
    this.subscriptions.push(this.merchantDashboardService.getDashboardDetails(filter).subscribe(res => {
      const chartType = Object.keys(res).toString();
      this[this._selectedTabType] = res[chartType];
    }));
  }

  initChartType(): AnalyticsFilter {
    this._filterParent['chart_type_value'] = `${this._selectedTabType}`;
    const subFilter = `sale_${this._selectedTabType}`;
    if (this[subFilter] && this[subFilter]['value']) {
      this.subFilterValue = this[subFilter].value;
      this._filterParent['chart_type_value'] = `${this._selectedTabType}_${this[subFilter].value}`;
    }
    return this._filterParent;
  }
  initTabValues(filter: AnalyticsFilter) {
    this.getDashboardDetails(filter);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
