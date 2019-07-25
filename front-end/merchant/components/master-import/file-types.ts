export class FileType {
    id: number;
    name: string;
}

export const FileTypeList = [
    { id: 1, name: 'Sales Invoice', path: 'assets/master_data/sample_master_data/sales_master_invoice.csv' },
    { id: 2, name: 'Sales Items', path: 'assets/master_data/sample_master_data/sales_master.csv' },
    { id: 3, name: 'Product Master', path: 'assets/master_data/sample_master_data/sku_master.csv' },
    { id: 4, name: 'Merchant Stores', path: 'assets/master_data/sample_master_data/store_locations.csv' }
];
