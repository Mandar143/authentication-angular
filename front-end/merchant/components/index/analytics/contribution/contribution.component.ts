import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs/typings';
import { MatButtonToggleChange, MatButtonToggleGroup } from '@angular/material';
import { MerchantDashboardService } from '../../merchant-dashboard.service';
import { Subscription } from 'rxjs';
import { AnalyticsFilter } from '../../analytics-filter';

@Component({
  selector: 'app-analytics-contribution',
  templateUrl: './contribution.component.html',
  styleUrls: ['./contribution.component.scss']
})
export class ContributionComponent implements OnInit, AfterViewInit, OnDestroy {

  protected _selectedTabIndex = 0;
  protected _selectedTabType: string;
  protected _selectedSubFilter: string;
  protected _filterParent: AnalyticsFilter;
  subscriptions: Subscription[] = [];
  private _initCounter = 1;

  @Input() set setFilter(filter: AnalyticsFilter) {
    this._filterParent = filter;
    this._selectedTabType = this.getTabType(this._selectedTabIndex);
    if (this._initCounter > 1) {
      this.initTabValues(this.initChartType());
    }
    ++this._initCounter;
  }
  @Input() userType: number;
  @ViewChild('contribution_store_sales') contribution_store_sales: MatButtonToggleGroup;
  @ViewChild('contribution_store_registered_customers') contribution_store_registered_customers: MatButtonToggleGroup;

  store_sales = [];
  store_registered_customers = [];
  chart_size = [800, 400];
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
      'store_sales',
      'store_registered_customers'
    ];
  }

  getTabType(index: number): string {
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
    const subFilter = `contribution_${this._selectedTabType}`;
    if (this[subFilter] && this[subFilter]['value']) {
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
