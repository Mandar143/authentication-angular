import { of } from "rxjs";
import { BaseDataSource } from 'src/app/shared/models/data-sources/_base.datasource';
import { QueryParamsModel } from 'src/app/shared/models/query-models/query-params.model';
import { tap, catchError, finalize } from 'rxjs/operators';
import { FeedbackService } from '../feedback.service';
import { QueryResultsModel } from 'src/app/shared/models/query-models/query-results.model';

export class FeedbackListDataSource extends BaseDataSource {

    constructor(
        private feedbackService: FeedbackService
    ) {
        super();
    }

    loadListFromServer(queryParams: QueryParamsModel) {
        this.loadingSubject.next(true);
        this.feedbackService.getList(queryParams).pipe(
            tap(res => this.loadDataToTable(res)),
            catchError(err => of(new QueryResultsModel([], err))),
            finalize(() => this.loadingSubject.next(false))
        ).subscribe();
    }

    loadDataToTable(resultFromServer) {
        this.entitySubject.next(resultFromServer.items);
        this.paginatorTotalSubject.next(resultFromServer.total);
    }
}