
import { of } from "rxjs";
import { BaseDataSource } from 'src/app/shared/models/data-sources/_base.datasource';
import { UserListService } from './user-list.service';
import { QueryParamsModel } from 'src/app/shared/models/query-models/query-params.model';
import { tap, catchError, finalize } from 'rxjs/operators';
import { QueryResultsUserListModel } from './userlist-results.notes';




export class UserListDataSource extends BaseDataSource {

    constructor(private userListService: UserListService) {
        super();
    }

    loadUsers(queryParams: QueryParamsModel) {
        this.loadingSubject.next(true);
        this.userListService.getAllUsers(queryParams).pipe(
            tap(res => this.loadAllUsers(res)),
            catchError(err => of(new QueryResultsUserListModel([], err))),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe();
    }

    loadAllUsers(resultFromServer) {
        // console.log(resultFromServer);
        this.entitySubject.next(resultFromServer.items);
        this.paginatorTotalSubject.next(resultFromServer.total);
    }
}