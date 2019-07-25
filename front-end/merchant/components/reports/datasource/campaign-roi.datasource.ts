import { BaseDataSource } from 'src/app/shared/models/data-sources/_base.datasource';
import { ReportsService } from '../reports.service';
import { QueryParamsModel } from 'src/app/shared/models/query-models/query-params.model';
import { tap, catchError, finalize } from 'rxjs/operators';
import { QueryResultsUserListModel } from '../../users/users-list/userlist-results.notes';
import { of } from 'rxjs';

export class CampaignROIDatasource extends BaseDataSource {
    constructor(private reportService: ReportsService) {
        super()
    }

    loadCampaignROI(queryParams: QueryParamsModel) {
        this.loadingSubject.next(true);
        this.reportService.getCampaignROI(queryParams).pipe(
            tap(res => this.loadROI(res)),
            catchError(err => of(new QueryResultsUserListModel([], err))),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe();
    }

    loadROI(resultFromServer) {
        this.entitySubject.next(resultFromServer.items);
        this.paginatorTotalSubject.next(resultFromServer.total);
    }
}