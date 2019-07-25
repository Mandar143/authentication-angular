
import { of } from "rxjs";
import { BaseDataSource } from 'src/app/shared/models/data-sources/_base.datasource';
import { QueryParamsModel } from 'src/app/shared/models/query-models/query-params.model';
import { tap, catchError, finalize } from 'rxjs/operators';
import { GetHomeBranchChangeRequestsService } from './get-home-change-requests.service';
import { QueryResultsUserListModel } from '../../../components/users/users-list/userlist-results.notes';




export class GetHomeBranchChangeRequestsDataSource extends BaseDataSource {

    constructor(
        private getHomeBranchChangeRequestsService: GetHomeBranchChangeRequestsService
    ) {
        super();
    }

    loadHomeBranchChangeLogs(queryParams: QueryParamsModel) {
        this.loadingSubject.next(true);
        this.getHomeBranchChangeRequestsService.getHomeBranchChangeRequests(queryParams).pipe(
            tap(res => this.loadAllHomeBranchChangeRequests(res)),
            catchError(err => of(new QueryResultsUserListModel([], err))),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe();
    }

    loadAllHomeBranchChangeRequests(resultFromServer) {
        // console.log("resultFromServer",resultFromServer);
        this.entitySubject.next(resultFromServer.items);
        this.paginatorTotalSubject.next(resultFromServer.total);
    }
}