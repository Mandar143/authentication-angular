import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { TypesUtilsService } from 'src/app/shared/services/types-utils.service';
import { UserListService } from '../users/users-list/user-list.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  dashboardFilter: FormGroup;
  selected: any;
  alwaysShowCalendars: boolean;
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Quarterly': [moment().startOf('month'), moment().quarters(3)],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  };
  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];
  userType: number;
  filteredOptions: Observable<any[]>;
  subMerchantLocationArray: any = [];
  startDate: any;
  endDate: any;
  defaultAllLocation = { 'id': 0, 'location_name': 'All Locations' };
  graphFilter = {};

  constructor(private authService: AuthService,
    private typeUtilsService: TypesUtilsService,
    private _formBuilder: FormBuilder,
    private userListService: UserListService) {
  }


  ngOnInit() {
    this.userType = this.authService.currentUser.user_type_id;
    // set start date and end date
    const date = new Date(), y = date.getFullYear(), m = date.getMonth();
    this.startDate = new Date(y, m - 3, 1);
    this.endDate = new Date();

    this.initService();
    this.createForm();
    this.graphFilter = {
      'start_date': this.typeUtilsService.transformDate(this.startDate, 'yyyy-MM-dd'),
      'end_date': this.typeUtilsService.transformDate(this.endDate, 'yyyy-MM-dd'),
      'chart_type_value': null,
      'sub_merchant_location_id': 0
    };
  }

  // date filter
  change(event) {
    const location = this.dashboardFilter.get('location').value;
    let locationId = 0;
    if (location) {
      locationId = location.id;
    }

  }

  createForm() {
    this.dashboardFilter = this._formBuilder.group({
      location: [this.defaultAllLocation],
      range: [{ startDate: this.startDate, endDate: this.endDate }]
    });

    this.dashboardFilter.valueChanges.subscribe(value => {
      this.graphFilter = {
        chart_type: 'month',
        sub_merchant_location_id: value.location.id
      };
      const range = value.range;
      if (range && range.startDate && range.endDate) {
        let startDate, endDate;
        if (range.startDate instanceof Date) {
          startDate = range.startDate;
          endDate = range.endDate;
        } else {
          startDate = range.startDate._d;
          endDate = range.endDate._d;
        }
        this.graphFilter['start_date'] = this.typeUtilsService.transformDate(startDate, 'yyyy-MM-dd');
        this.graphFilter['end_date'] = this.typeUtilsService.transformDate(endDate, 'yyyy-MM-dd');
        this.graphFilter['chart_type'] = 'date';
      }
    });
  }

  selectLocation(value) {
  }

  displayFn(user?: any): any | undefined {
    if (typeof user === 'object') {
      return user ? user.location_name : undefined;
    }
  }

  locationValueChange() {
    const locationControl = this.dashboardFilter.get('location');
    this.filteredOptions = locationControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: any): any[] {
    if (value !== null) {
      const filterValue = value.toString().toLowerCase();
      return this.subMerchantLocationArray.filter(
        option => option.location_name.toLowerCase().indexOf(filterValue.toLowerCase()) > -1);
    }
  }

  initService() {
    const userTypeId = this.authService.currentUser.user_type_id;
    if (userTypeId === 4) {
      const id = { 'sub_merchant_id': this.authService.currentUser.sub_merchant_id };
      this.userListService.getSubMerchantLocations(id).subscribe(
        res => {
          this.subMerchantLocationArray = res.data['merchant_location_list'];
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some(d => d.isSame(m, 'day'));
  }
}
