export class UserModel {
  // id?:number;
  // first_name?: string;
  // last_name?: string;
  // username?: string;
  // contact?: string;
  // password?: string;
  // confirm_password?: string;
  // email?: string;
  // gender?: number;
  // user_type_id?: number;
  // sub_merchant_id?: number;
  // sub_merchant_location_id?: number;

  // clear() {
  //   this.first_name = '';
  //   this.last_name = '';
  //   this.username = '';
  //   this.contact = '';
  //   this.password = '';
  //   this.confirm_password = '';
  //   this.email = '';
  //   this.gender = null;
  //   this.user_type_id = null;
  //   this.sub_merchant_id = null;
  //   this.sub_merchant_location_id = null;
  // }

  id?:number;
    first_name?: string;
    user_type_id: number;
    last_name?: string;
    email_address?: string;
    mobile_number?: number;
    contact?:number;
    gender?: number;
    status?: number;// 0 = Active | 1 = Inactive
    avatar?: string;
    type?: number;
    confirm_password?: string;
    otp?: number;
    date_of_birth?: any;
    marital_status?: number;
    anniversary_date?: any;
    spouse_dob?: any;
    username?: string;
    password?: string;
    isLoggedin: Boolean;
    location_name:string;
    sub_merchant_id: number;
    sub_merchant_location_id: number;
    sub_merchant_location_name: string;
    email: string;
    created_by: number;
    userProfileUpdate: string;

    clear() {
      this.id=null;
      this.confirm_password = '';
        this.first_name = '';
        this.location_name='';
        this.user_type_id = null;
        this.last_name = '';
        this.email_address = '';
        this.mobile_number = null;
        this.gender = null;
        this.status = null;
        this.avatar = '';
        this.type = null;
        this.otp = null;
        this.date_of_birth = '';
        this.marital_status = null;
        this.anniversary_date = '';
        this.spouse_dob = '';
        this.username = '';
        this.password = '';
        this.isLoggedin = false;
        this.sub_merchant_id = null;
        this.sub_merchant_location_id = null;
        this.sub_merchant_location_name = '';
        this.email = '';
        this.created_by = null;
        this.userProfileUpdate = '';
    }
}
