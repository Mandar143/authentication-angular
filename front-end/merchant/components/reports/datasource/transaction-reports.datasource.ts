import { BaseDataSource } from 'src/app/shared/models/data-sources/_base.datasource';
import { QueryParamsModel } from 'src/app/shared/models/query-models/query-params.model';
import { tap, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { ReportsService } from '../reports.service';
import { QueryResultsUserListModel } from '../../users/users-list/userlist-results.notes';



export class TransactionReportsDatasource extends BaseDataSource {

    constructor(private reportService: ReportsService) {
        super();
    }

    loadTransactionList(queryParams: QueryParamsModel) {
        this.loadingSubject.next(true);
        this.reportService.getTransactions(queryParams).pipe(
            tap(res => this.loadListing(res)),
            catchError(err => of(new QueryResultsUserListModel([], err))),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe();
    }

    // loadAllList(resultFromServer) {
    //     this.entitySubject.next(resultFromServer.items);
    //     this.paginatorTotalSubject.next(resultFromServer.total);
    // }
}