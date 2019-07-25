import { Component, OnInit, ViewChild, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { MatPaginator, MatSort, MatDialog, MatDialogRef, MatTableDataSource } from '@angular/material';
import { UserModel } from '../model/user.model';
import { UserListService } from 'src/app/merchant/components/users/users-list/user-list.service';
import { AuthService } from '../../../../services/authentication/auth.service';
import { merge, Observable } from 'rxjs';
import { tap, share, count, startWith, map } from 'rxjs/operators';
import { QueryParamsModel } from 'src/app/shared/models/query-models/query-params.model';
import { UserListDataSource } from './users-list.datasource';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import { UserLogsComponent } from 'src/app/shared/components/user-logs/user-logs.component';
import { UserFilterModel } from './user.filter.model';
import { DateConstant } from 'src/app/shared/components/constant/date-constant';
export interface PeriodicElement {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: number,
  userName: string;
  gender;
}
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  searchForm: FormGroup;
  filter: UserFilterModel;
  displayedColumns: string[] = [
    // 'avatar',
    'first_name',
    'merchant_name',
    'sub_merchant_name',
    'location_name',
    'email',
    'contact',
    'status',
    'created_at',
    'actions'
  ];
  //dataSource: any;
  dataSource: UserListDataSource;
  selection = new SelectionModel<UserModel>(true, []);
  userModel: UserModel;
  oldUserModel: UserModel;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  formControlArray: string[];
  btnOutline: Boolean = true;
  panelState: Boolean = false;
  panelStateSearch: Boolean = false;
  hide: boolean = true;
  confirmHide: boolean = true;
  userResult: any;
  user_type_id: number = 0;

  submitButton: string = 'Submit';
  subMerchantLocationArray: any = [];
  filteredOptions: Observable<any[]>;
  user: UserModel;
  isEdit: Boolean = false;
  adminId: number;
  currentUserId: number;
  userNameDisabled: boolean = false;
  editValueId: any;
  isRequired: Boolean = true;
  subMerchantValidation: Boolean = false;
  locationValidation: Boolean = false;
  merchantPlaceholderMsg: string;
  currentUserTypeId: number;
  userTypeArray: any;
  editPanel: boolean = false;
  dateFormate: any;
  
  constructor(
    private _formBuilder: FormBuilder,
    private userListService: UserListService,
    private authService: AuthService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    // Date formate as 'dd MMM yyyy'
    this.dateFormate = DateConstant.dateFormate;
    
    const newUserModel = new UserModel();
    newUserModel.clear();
    this.userModel = newUserModel;
    this.oldUserModel = Object.assign({}, newUserModel);
    this.createForm();

    this.currentUserTypeId = this.authService.currentUser.user_type_id;
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.loadUsersList();
        })
      )
      .subscribe();
    const queryParams = new QueryParamsModel(this.filterConfiguration(true));
    queryParams.sortOrder = 'desc'; // sort by createdAt
    this.dataSource = new UserListDataSource(this.userListService);
    // First load
    this.dataSource.loadUsers(queryParams);
    this.dataSource.entitySubject.subscribe(res => {
      this.userResult = res;
    });

    if (this.currentUserTypeId == 4) {
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

  submitToComponent($event) {
    const clickSubmitButton = $event;
    this.loadUsersList();
    this.panelState = !this.panelState;
  }

  /* ngOnChanges() {
    console.log('ngOnChanges');

    this.loadUsersList();
  } */

  loadUsersList() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(true),
      this.sort.direction,
      this.sort.active,
      this.paginator.pageIndex,
      this.paginator.pageSize,

    );

    this.dataSource.loadUsers(queryParams);
  }

  displayFn(user?: any): any | undefined {
    if (typeof user == "object") {
      let locationName = user ? user.location_name : undefined;
      return locationName;
    }
  }

  selectLocation(value) {
    //const locationControl = this.searchForm.get('location_name');
    //locationControl.setValue(value.id)
    //locationControl.updateValueAndValidity();
  }

  locationValueChange() {
    const locationControl = this.searchForm.get('location_name');
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

  filterReset() {
    this.searchForm.reset();
    this.loadUsersList();
  }
  filterConfiguration(isGeneralSearch: boolean = true): any {
    let filter: any = {};
    
    if (!isGeneralSearch) {
      return filter;
    }

    const formValues = this.searchForm.value;
    for (const field in formValues) {
      if (formValues[field]) {
        filter[field] = formValues[field];
      }
    }
    if(!this.panelStateSearch){
      filter = {};
    }
    return filter;
  }

  togglePanel() {
    this.isEdit = false;
    this.submitButton = 'Submit';
    this.hide = true;
    this.confirmHide = true;
    this.isRequired = true;
    this.editPanel = false;
    this.panelState = !this.panelState;
    if (this.panelStateSearch) {
      this.panelStateSearch = !this.panelStateSearch;
    }
  }
  //RE-Usable Component Logic
  togglePanelSearch() {
    // this.loadUsersList();
    if (this.panelState) {
      this.panelState = !this.panelState;
    }
    this.panelStateSearch = !this.panelStateSearch;
    if (this.panelStateSearch) {
      this.createForm();
    }
    this.loadUsersList();
  }

  createForm() {
    this.searchForm = this._formBuilder.group({
      first_name: [
        this.userModel.first_name,
        Validators.compose([
          Validators.pattern(/^[a-zA-Z ]{1,20}$/)
        ])
      ],
      last_name: [
        this.userModel.last_name,
        Validators.compose([
          Validators.pattern(/^[a-zA-Z ]{1,20}$/)
        ])
      ],
      username: [
        this.userModel.username,
        [
          Validators.compose([
            Validators.pattern(/^[ A-Za-z0-9_@!@#$&*.]{3,15}$/)
          ])
        ]
      ],
      contact: [
        this.userModel.contact,
        [
          Validators.compose([
            Validators.pattern(/^[0-9]\d{7,14}$/),
            Validators.minLength(8)
          ])
        ]
      ],
      location_name: [
        this.userModel.location_name        
      ]
    });
  }

  editUser(editUserData) {
    const element = document.querySelector('.scrollToTop');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
    // this.editPanel = !this.editPanel;
    this.hide = false;
    this.confirmHide = false;
    this.isRequired = false;
    this.panelState = !this.panelState;
    this.isEdit = true;
    this.submitButton = 'Update';
    this.user = editUserData;
    // this.hide = true;

  }
  deleteUser(deleteUserData) {
    // Swal.fire({ title: `Are you sure want to delete ${deleteUserData.first_name} ${deleteUserData.last_name}?`, showCancelButton: true }).then(result => {

    let message = `Do you want to remove "${deleteUserData.first_name} ${deleteUserData.last_name}"?`;
    // let showCancelButton = true;

    Swal.fire({ title: message, showCancelButton: true, showCloseButton: true }).then(result => {
      if (result.value) {
        let deleteData = {
          'id': deleteUserData.id
        }
        this.userListService.deleteUser(deleteData).subscribe(res => {
          if (res) {
            Swal.fire('Success', "User deleted successfully", 'success');
            this.loadUsersList();
          }
        }, err => {
          Swal.fire('Oops...', 'Something went wrong', 'error')
        });

      } else {

      }
    })

  }
  logsUser(logsUserData) {
    const dialogRef = this.dialog.open(UserLogsComponent, {
      autoFocus: true,
      disableClose: true,
      width: '500px',
      panelClass: 'delete-dialog',
      data: logsUserData
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      else {

      }


    });
  }
}
