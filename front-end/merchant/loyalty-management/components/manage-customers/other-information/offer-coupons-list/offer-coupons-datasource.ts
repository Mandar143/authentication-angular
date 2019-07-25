import { of } from "rxjs";
import { BaseDataSource } from 'src/app/shared/models/data-sources/_base.datasource';
import { QueryParamsModel } from 'src/app/shared/models/query-models/query-params.model';
import { tap, catchError, finalize } from 'rxjs/operators';
import { OfferCouponsService } from './offer-coupons.service';


export class QueryResultsModel {
    // fields
    items: any[];
    totalCount: number;
    errorMessage: string;

    constructor(_items: any[] = [], _errorMessage: string = '') {
        this.items = _items;
        this.totalCount = _items.length;
    }
}

export class OfferCouponsDataSource extends BaseDataSource {

    constructor(
        private OfferCouponsService: OfferCouponsService
    ) {
        super();
    }

    loadListFromServer(queryParams: QueryParamsModel) {
        this.loadingSubject.next(true);
        this.OfferCouponsService.getList(queryParams).pipe(
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