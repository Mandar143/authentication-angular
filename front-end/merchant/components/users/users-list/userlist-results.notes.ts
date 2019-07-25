export class QueryResultsUserListModel {
    // fields
    items: any[];
    totalCount: number;
    errorMessage: string;

    constructor(_items: any[] = [], _errorMessage: string = '') {
        this.items = _items;
        this.totalCount = _items.length;
    }
}