
import { of } from "rxjs";
import { BaseDataSource } from 'src/app/shared/models/data-sources/_base.datasource';
import { QueryParamsModel } from 'src/app/shared/models/query-models/query-params.model';
import { tap, catchError, finalize } from 'rxjs/operators';
import { QueryResultsUserListModel } from '../../../components/users/users-list/userlist-results.notes';
import { ManageCustomerListService } from './manage-customer-list.service';




export class ManageCustomersListDatasource extends BaseDataSource {

    constructor(
        private manageCustomerListService: ManageCustomerListService
    ) {
        super();
    }

    loadCustomerListLogs(queryParams: QueryParamsModel) {
        this.loadingSubject.next(true);
        this.manageCustomerListService.getManagaeCustomerList(queryParams).pipe(
            tap(res => this.loadAllCustomerList(res)),
            catchError(err => of(new QueryResultsUserListModel([], err))),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe();
    }

    loadAllCustomerList(resultFromServer) {
        // console.log("resultFromServer",resultFromServer);
        this.entitySubject.next(resultFromServer.items);
        this.paginatorTotalSubject.next(resultFromServer.total);
    }
}