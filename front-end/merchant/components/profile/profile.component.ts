import { Component, OnInit } from '@angular/core';
import { UserModel } from '../users/model/user.model';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: UserModel;
  //currentUser: User = new User();
  isEdit: Boolean;
  abc: any;
  oldUserModel: UserModel;
  updateProfile: boolean;
  submitButton: string = 'Update Profile';
  constructor(private auth: AuthService,
    private profileService: ProfileService) {
    }

  ngOnInit() {
    // console.log(this.auth.currentUser);
    // this.abc = this.auth.currentUser;
    // console.log(this.abc);
    // this.user = this.abc;

    const currentUserId = this.auth.currentUser['user_id'];
    this.profileService.getUserProfileDetails(currentUserId).subscribe(
      res => {
        // console.log(res);
        let newUser = new UserModel();
        if (res){
          this.updateProfile = true;
        } else {
          this.updateProfile = false;
        }
        newUser.clear();
        newUser = Object.assign(new UserModel, res['profile_details'][0]);
        this.user = newUser;
        this.isEdit = true;
    });
  }

}
