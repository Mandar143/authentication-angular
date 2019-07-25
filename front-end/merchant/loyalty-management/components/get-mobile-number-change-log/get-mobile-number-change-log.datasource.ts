
import { of } from "rxjs";
import { BaseDataSource } from 'src/app/shared/models/data-sources/_base.datasource';
import { QueryParamsModel } from 'src/app/shared/models/query-models/query-params.model';
import { tap, catchError, finalize } from 'rxjs/operators';
import { GetMobileNumberChangeLogService } from './get-mobile-number-change-log.service';
import { QueryResultsUserListModel } from '../../../components/users/users-list/userlist-results.notes';




export class GetMobileNumberChangeLogDataSource extends BaseDataSource {

    constructor(
        private getMobileNumberChangeLogService: GetMobileNumberChangeLogService
    ) {
        super();
    }

    loadMobileNumberChangeLogs(queryParams: QueryParamsModel) {
        this.loadingSubject.next(true);
        this.getMobileNumberChangeLogService.getMobileNumberChangeLog(queryParams).pipe(
            tap(res => this.loadAllMobileNumberChangeRequest(res)),
            catchError(err => of(new QueryResultsUserListModel([], err))),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe();
    }

    loadAllMobileNumberChangeRequest(resultFromServer) {
        // console.log("resultFromServer",resultFromServer);
        this.entitySubject.next(resultFromServer.items);
        this.paginatorTotalSubject.next(resultFromServer.total);
    }
}