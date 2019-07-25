import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/customer/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { TokenStorage } from 'src/app/services/authentication/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide: boolean;
  isRequestForOtp: boolean;
  animationState = 'down';
  loginForm: FormGroup;
  user: User = new User();
  defaultRout = 'index';
  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z-9])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;
  usernameRegex = /^[ A-Za-z0-9_@!@#$&*.]*$/;
  constructor(private _formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private tokenStorage: TokenStorage
  ) {
    this.hide = true;
  }

  ngOnInit() {
    let localDefaultPath: string;
    if (this.authService.loggedIn) {
      if ((localDefaultPath = this.tokenStorage.getDefaultPath())) {
        this.defaultRout = localDefaultPath;
      }
      /* if (this.authService.currentUser.isCustomer) {
        this.router.navigate(['/dashboard']);
      } else if (this.authService.currentUser.user_type_id == 4) {
        this.router.navigate(['/merchant/loyalty-management']);
      } else {
        this.router.navigate(['/merchant/index']);
      } */
      this.router.navigate([`${this.defaultRout}`]);
    }
    this.loginForm = this.createForm();

  }
  createForm() {
    return this._formBuilder.group({
      username: [this.user.username, [Validators.required, Validators.pattern(this.usernameRegex), Validators.minLength(5)]],
      password: [this.user.password, [Validators.required, Validators.pattern(this.passwordPattern), Validators.minLength(8)]]
    });
  }

  requestLogin() {
    this.userService.login(this.loginForm.value).subscribe(res => {
      if (!res) {
        return;
      }
      this.router.navigateByUrl(res);
    }, error => {
      // this.loginForm.reset();

      if (error.status === 422) {
        if (!error.error.error.details) {
        } else {
          const form = this.loginForm;
          const serverErrors = error.error.error.details;
          Object.values(serverErrors).forEach(prop => {
            const formControl = form.get(prop['key']);
            if (formControl) {
              formControl.setErrors({
                serverError: true,
                message: prop['message']
              });
              formControl.markAsTouched();
            }
          });
        }
      }
    })
  }
}
