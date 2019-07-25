import { OnInit, Component, ViewChild } from '@angular/core';
import { ReportsService } from '../reports.service';
import { CampaignROIDatasource } from '../datasource/campaign-roi.datasource';
import { QueryParamsModel } from 'src/app/shared/models/query-models/query-params.model';
import { MatPaginator, MatSort } from '@angular/material';
import { Subscription, merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TypesUtilsService } from 'src/app/shared/services/types-utils.service';
import { DateConstant } from 'src/app/shared/components/constant/date-constant';

@Component({
    selector: 'app-campaign-roi',
    templateUrl: './campaign-roi.component.html',
    styleUrls: ['./campaign-roi.component.scss']
})

export class CampaignROIComponent implements OnInit {
    campaignROIForm: FormGroup;

    displayedColumns: string[] = [
        'campaign_title',
        'contacted_customers',
        'responding_customers',
        'responder_sales',
        'hit_rate',
        'responder_abv',
        'responder_txns',
        'responder_atv',
        'coupon_issued',
        'coupon_redeemed',
        'redemption_revenue',
    ];

    dataSource: any;
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
    downloadedData: any[];
    subscriptions: Subscription[] = [];
    campaignROIResult: any[];
    panelStateSearch: boolean;
    startDate: any;
    endDate: any;
    maxDate: Date = new Date();
    filterDataSource: any;
    formControls: any;
    dateFormate: any;
    constructor(
        private _formBuilder: FormBuilder,
        private reportService: ReportsService,
        private typesUtilsService: TypesUtilsService
    ) { }

    ngOnInit() {
        // Date formate as 'dd MMM yyyy'
        this.dateFormate = DateConstant.dateFormate;

        const date = new Date(), y = date.getFullYear(), m = date.getMonth();
        this.startDate = new Date(y, m - 1, 1);
        this.endDate = new Date(y, m, 0);
        this.filterDataSource = {
            "from_date": this.typesUtilsService.transformDate(this.startDate, 'yyyy-MM-dd'),
            "to_date": this.typesUtilsService.transformDate(this.endDate, 'yyyy-MM-dd')
        }

        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                tap(() => {
                    this.loadCampaignROI();
                })
            )
            .subscribe();

        const queryParams = new QueryParamsModel(this.filterConfiguration(true));
        queryParams.sortOrder = 'desc';
        this.dataSource = new CampaignROIDatasource(this.reportService);
        this.dataSource.loadCampaignROI(queryParams);
        this.dataSource.entitySubject.subscribe(res => {
            this.campaignROIResult = res;
        });
        this.formControls = 'campaign-roi';
    }

    loadCampaignROI() {
        const queryParams = new QueryParamsModel(
            this.filterConfiguration(true),
            this.sort.direction,
            this.sort.active,
            this.paginator.pageIndex,
            this.paginator.pageSize,
        );
        this.dataSource.loadCampaignROI(queryParams);
    }

    filter() {
        this.paginator.pageIndex = 0;
        this.loadCampaignROI();
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
        return filter;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
    filterReset() {
        this.campaignROIForm.reset();
        this.loadCampaignROI();
    }

    togglePanelSearch() {
        this.panelStateSearch = !this.panelStateSearch;
    }
    onSubmit(data) {
        this.filterDataSource = data;
        this.paginator.pageIndex = 0;
        this.loadCampaignROI();
    }
}