import { of } from "rxjs";
import { BaseDataSource } from 'src/app/shared/models/data-sources/_base.datasource';
import { QueryParamsModel } from 'src/app/shared/models/query-models/query-params.model';
import { tap, catchError, finalize } from 'rxjs/operators';
import { QueryResultsUserListModel } from '../../../../../components/users/users-list/userlist-results.notes';
import { CustomerTransactionsService } from './customer-transactions.service';




export class CustomerTransactionsDataSource extends BaseDataSource {

    constructor(
        private customerTransactionsService: CustomerTransactionsService
    ) {
        super();
    }

    loadTransactionLogs(queryParams: QueryParamsModel) {
        this.loadingSubject.next(true);
        this.customerTransactionsService.getTransactions(queryParams).pipe(
            tap(res => this.loadAllTransactions(res)),
            catchError(err => of(new QueryResultsUserListModel([], err))),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe();
    }

    loadAllTransactions(resultFromServer) {
        this.entitySubject.next(resultFromServer.items);
        this.paginatorTotalSubject.next(resultFromServer.total);
    }
}