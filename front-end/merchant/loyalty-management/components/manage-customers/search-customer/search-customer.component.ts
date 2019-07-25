import { Component, OnInit, OnDestroy, DoCheck, EventEmitter, Output, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { MatRadioGroup, MatRadioChange } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { tap, debounceTime, distinctUntilChanged, filter, switchMap, finalize } from 'rxjs/operators';
import { ManageCustomersService } from '../manage-customers.service';
import { of, Subscription } from 'rxjs';
import { SpinnerButtonOptions } from 'src/app/shared/components/spinner-button/button-options.interface';

export interface FieldData {
  label: string;
  maxlength: number;
  inputPattern: any; replacePattern: any;
  validation: [];
}

export class SearchCustomer {
  search_by_type: string;
  search_label: string;
  search_by_value: string;
  search_by_name: string;
  request_type: number = 1;
}
export interface Customer {
  first_name: string;
  last_name: string;
  mobile_number: string;
}
@Component({
  selector: 'app-search-customer',
  templateUrl: './search-customer.component.html',
  styleUrls: ['./search-customer.component.scss']
})
export class SearchCustomerComponent implements OnInit, OnDestroy, AfterViewInit {
  customerSearch: FormGroup;
  filedLabel = 'Search By Mobile Number';
  searchByField: string;
  maxlength = 10;
  subscriptions: Subscription[] = [];
  isLoading = false;
  customerList = [];
  selectedCustomer: Customer;
  spinner: SpinnerButtonOptions = {
    active: false,
    spinnerSize: 18,
    raised: true,
    buttonColor: '',
    spinnerColor: 'primary',
    fullWidth: false,
    mode: 'indeterminate'
  };
  searchCustomer: SearchCustomer;
  @ViewChild('searchLabel') searchLabelField: ElementRef;
  @Output() customer = new EventEmitter();
  constructor(
    private _formBuilder: FormBuilder,
    private manageCustomerService: ManageCustomersService) { }

  ngOnInit() {
    this.searchCustomer = new SearchCustomer();
    this.searchByField = 'mobile_number';
    this.customerSearch = this.createForm();
    this.initFormChanges();
  }

  ngAfterViewInit() {
    // console.log(this.searchCustomerComponent);
    // this.searchLabelField.nativeElement.focus();
  }
  getFieldData(fieldName: string): FieldData {
    const data = {
      'mobile_number': {
        label: 'Search By Mobile Number',
        maxlength: 10,
        validation: [Validators.required, Validators.minLength(10), Validators.maxLength(13)],
        inputPattern: /^[0-9]*$/,
        replacePattern: /[^0-9]/g,
        debounceTime: 0
      },
      'customer_name': {
        label: 'Search By Customer Name',
        maxlength: 50,
        validation: [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
        inputPattern: /^[a-z A-Z]+$/,
        replacePattern: /[^a-z A-Z]/g,
        debounceTime: 500
      }
    };
    return data[fieldName] || data[this.searchByField];
  }

  createForm() {
    return this._formBuilder.group({
      search_by_type: [this.searchCustomer.search_by_type || this.searchByField],
      search_label: [this.searchCustomer.search_label || null, this.getFieldData(this.searchByField).validation],
      search_by_value: [this.searchCustomer.search_by_value || null],
      search_by_name: [this.searchCustomer.search_by_name || null],
      request_type: [this.searchCustomer.request_type]
    });
  }
  handleChange(event: MatRadioChange) {
    const fieldData = this.getFieldData(event.value);
    const control = this.customerSearch.get('search_label');
    control.reset();
    this.maxlength = fieldData.maxlength;
    this.filedLabel = fieldData.label;
    control.setValidators(fieldData.validation);
    control.updateValueAndValidity();
  }

  initFormChanges() {
    const serachByControl = this.customerSearch.get('search_by_type');
    const searchByLabelControl = this.customerSearch.get('search_label');
    const searchByValueControl = this.customerSearch.get('search_by_value');
    const searchByNameControl = this.customerSearch.get('search_by_name');
    this.searchByField = serachByControl.value;

    this.customerSearch.get('search_by_type').valueChanges
      .pipe(tap((change) => {
        this.spinner.active = false;
        this.selectedCustomer = null;
        searchByLabelControl.reset();
        searchByNameControl.reset();
        const fieldData = this.getFieldData(change);
        searchByValueControl.reset();
        this.maxlength = fieldData.maxlength;
        this.filedLabel = fieldData.label;
        searchByLabelControl.setValidators(fieldData.validation);
        searchByLabelControl.updateValueAndValidity();
        this.customerList = [];
        this.searchByField = change;
        this.customer.emit(null);
      })).subscribe();

    this.subscriptions.push(searchByLabelControl.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        filter((value) => value && searchByLabelControl.valid),
        tap(() => (this.isLoading = true)),
        switchMap(value => {
          if (this.searchByField === 'customer_name' && typeof value === 'string') {
            return this.manageCustomerService.getUsersSuggestion({ searchString: value }).pipe(finalize(() => (this.isLoading = false)));
          }
          return of(value).pipe(finalize(() => (this.isLoading = false)));
        })
      ).subscribe(result => {
        if (typeof result !== 'string' && result instanceof Array) {
          this.customerList = result;
        }
        if (typeof result === 'string') {
          searchByValueControl.setValue(result);
        }
      }));
  }

  inputValidator(event: any) {
    this.selectedCustomer = null;
    const searchByControl = this.customerSearch.get('search_by_type');
    const fieldData = this.getFieldData(searchByControl.value);
    const pattern = fieldData.inputPattern;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(fieldData.replacePattern, '');
    }
  }

  getFieldName(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase().replace('_', ' ');
  }

  getCustomer(customer: Customer, formValues) {
    this.selectedCustomer = customer;
    this.customerSearch.get('search_by_value').setValue(customer.mobile_number);
    this.customerSearch.get('search_by_name').setValue(customer.first_name + ' ' + customer.last_name);
    const control = this.customerSearch.get('search_label');
    const label = customer.first_name + ' ' + customer.last_name; // + ' (' + customer.mobile_number + ')';
    control.setValue(label);

    this.spinner.active = false;
    control.updateValueAndValidity();
    formValues['search_by_name'] = this.customerSearch.get('search_by_name').value;
    formValues['search_by_value'] = customer['mobile_number'];
    this.searchCustomers(formValues);
  }

  displayCustomerFn(customer: Customer) {
    const displayName = customer ? customer.first_name + ' ' + customer.last_name : ''; // + '(' + customer.mobile_number + ')' : '';
    return customer ? customer.first_name ? displayName : customer : '';
  }

  updateValue(value) {
    const labelControl = this.customerSearch.get('search_label');
    const valueControl = this.customerSearch.get('search_by_value');
    const nameControl = this.customerSearch.get('search_by_name');
    if (!value) {
      labelControl.reset();
      valueControl.reset();
      nameControl.reset();
    }
    if (labelControl.invalid) {
      valueControl.reset();
    }
  }

  callSearchMethod(event, formValues) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 13) {
      this.searchCustomers(formValues);
    }
  }

  searchCustomers(formValues) {
    // const labelControl = this.customerSearch.get('search_label');
    this.spinner.active = true;
    let defaultMsg = 'Customer name does not exists.';
    const searchForm = this.customerSearch;
    this.customer.emit(null);
    if (!formValues['search_by_value']) {
      formValues['search_by_value'] = formValues['search_label']; // labelControl.value;
    }

    if (!searchForm.valid) {
      if (this.searchByField === 'mobile_number') {
        defaultMsg = 'Mobile number is required.';
      } else if (this.searchByField === 'customer_name') {
        defaultMsg = 'Customer name does not exists.';
      }

      return this.setError(defaultMsg);
    }

    // const formValues = searchForm.value;
    if (this.searchByField === 'customer_name' && this.selectedCustomer === null) {
      return this.setError(defaultMsg);
    }

    this.manageCustomerService.searchCustomer(formValues).subscribe(
      result => {
        this.spinner.active = false;
        if ('statusCode' in result) {
          return this.setError(result.message);
        }

        this.customer.emit(result);
      },
      error => {
        this.spinner.active = false;
        if (error.status === 422) {
          if (this.searchByField === 'mobile_number') {
            defaultMsg = 'Please enter valid mobile number.';
          } else if (this.searchByField === 'customer_name') {
            defaultMsg = 'Customer name does not exists.';
          }
          return this.setError(defaultMsg);
        }
      }
    );
  }

  setError(message: string) {
    const labelControl = this.customerSearch.get('search_label');
    labelControl.setErrors({ serverError: true, message });
    labelControl.markAsTouched();
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
