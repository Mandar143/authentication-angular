import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AnalyticsFilter } from '../../analytics-filter';
import { Subscription, forkJoin } from 'rxjs';
import { MerchantDashboardService } from '../../merchant-dashboard.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  @Input() set setFilter(filter: AnalyticsFilter) {
    this.initService(filter);
  }

  gender_details = [];
  user_status = [];
  status_details_new = [];

  colorScheme = {
    domain: ['#2ca4d2', '#db768f', '#C7B42C', '#AAAAAA']
  };

  memberColorScheme = {
    domain: ['#5AA454', '#2ca4d2', '#C7B42C', '#AAAAAA']
  };
  viewPie: any[] = [500, 200];

  constructor(private merchantDashboardService: MerchantDashboardService) { }

  ngOnInit() {
  }

  getDashboardDetails(filter: AnalyticsFilter) {
    return this.merchantDashboardService.getDashboardDetails(filter);
  }

  graphList() {
    return [
      'gender_details',
      'user_status',
      'status_details_new'
    ];
  }

  initGraphServces(filter: AnalyticsFilter) {
    const serviceCollection = [];
    const graphLists = this.graphList();
    for (const graph of graphLists) {
      const currentFilter = { ...filter, chart_type_value: graph };
      serviceCollection.push(this.getDashboardDetails(currentFilter));
    }
    return serviceCollection;
  }

  initService(filter: AnalyticsFilter) {
    this.subscriptions.push(
      forkJoin(this.initGraphServces(filter))
        .subscribe(result => {
          for (const graph of result) {
            const chartType = Object.keys(graph).toString();
            this[chartType] = graph[chartType];
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
