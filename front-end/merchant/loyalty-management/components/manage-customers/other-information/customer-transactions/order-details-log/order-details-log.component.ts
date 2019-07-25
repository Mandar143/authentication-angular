import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { UserLogsService } from 'src/app/shared/components/user-logs/user-logs.service';
import { CustomerTransactionsService } from '../customer-transactions.service';
import { QueryParamsModel } from 'src/app/shared/models/query-models/query-params.model';

@Component({
  selector: 'app-order-details-log',
  templateUrl: './order-details-log.component.html',
  styleUrls: ['./order-details-log.component.scss']
})
export class OrderDetailsLogComponent implements OnInit {

  firstName: any;
  lastName: any;
  dataSource: any;
  pipe = new DatePipe("en-IN"); // Use your own locale
  displayedColumns: string[] = [
    // 'avatar',
    // 'product_name',
    'SKU',
    'product_quantity',
    'product_mrp',
    'product_price',
    'discounted_amount'
  ];
  constructor(public dialogRef: MatDialogRef<OrderDetailsLogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(LOCALE_ID) private local: string,
    public dialog: MatDialog, private authService: AuthService, 
    private userLogService: UserLogsService,
    private customerTransactionsService: CustomerTransactionsService,) { }

  ngOnInit() {
    if (this.data) {
      this.firstName = this.data["first_name"];
      this.lastName = this.data["last_name"];
    }
    let orderId = {
      "id": this.data["id"]
    }
    
    this.customerTransactionsService.getOrderDetails(orderId).subscribe(res => {
         this.dataSource = res;
    }, err => {
      console.log(err);
    })

  }
  transformDate(date: Date = new Date(), dateFormat: string = 'dd/MM/yyyy hh:mm a') {
    return this.pipe.transform(date, dateFormat, this.local);
  }
  closeDialog() {
    this.dialogRef.close();
  }
  filterConfiguration(isGeneralSearch: boolean = true): any {

    const filter: any = {};

    if (!isGeneralSearch) {
      return filter;
    }

    // const formValues = this.searchForm.value;
    // if(formValues["order_status"]==0){
    //   delete formValues["order_status"];
    // }
    // for (const field in formValues) {
    //   if (formValues[field]) {
        
    //     filter[field] = formValues[field];
    //   }
    // }
    // console.log(filter);

    return filter;
  }



}
