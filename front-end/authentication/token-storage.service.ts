import { environment } from 'src/environments/environment';
import { User } from 'src/app/shared/models/user-model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as SecureLS from 'secure-ls';
import { JwtHelperService } from '@auth0/angular-jwt';

export interface Menu {
    icon: string;
    path: string;
    title: string;
    children?: Menu[];
}

@Injectable({
    providedIn: 'root'
})

export class TokenStorage {
    ENCRYPTION_KEY = environment.encriptionKey;
    tempToken = null;
    tempActions = null;
    tempDefaultPath = null;
    constructor(
        private router: Router,
        private jwtHelper: JwtHelperService) { }
    /**
       * Get access token
       * @returns {Observable<string>}
       */
    public getAccessToken(): string {
        if (this.tempToken) {
            this.setAccessToken({ token: this.tempToken });
            return this.tempToken;
        }

        const token: string = <string>localStorage.getItem(environment.accessTokenParam);
        this.tempToken = token;
        return token;
    }

    public getActions(): string {
        if (this.tempActions) {
            this.setActions(this.tempActions);
            return this.tempActions;
        }

        const actions: string = <string>localStorage.getItem('actions');
        this.tempActions = actions;
        return actions;
    }

    /**
       * Get bearer token
       * @returns {Observable<string>}
       */
    /* public getBearerToken(): string {
        const token: string = <string>localStorage.getItem(environment.bearerTokenParam);
        return token;
    } */

    /**
       * Get user emailid
       * @returns string
       */
    public getEmailID(): string {
        const userInfo = this.getUserInfo();
        if (userInfo) {
            return userInfo.email;
        }
    }

    /**
       * Get user Mobile Number
       * @returns string
       */
    public getMobileNumber(): string {
        const userInfo = this.getUserInfo();
        if (userInfo) {
            return userInfo.mobileNumber;
        }
    }

    /**
       * Get user roleid string
       * @returns string
       */
    public getUserRoleID() {
        const userInfo = this.getUserInfo();
        if (userInfo) {
            return userInfo.roleId;
        }
    }

    /**
    * Get userid string
    * @returns string
    */
    public getUserID() {
        const userInfo = this.getUserInfo();
        if (userInfo) {
            return userInfo.userId;
        }
    }
    /**
       * Set access token
       * @returns {TokenStorage}
       */
    public setAccessToken(data: any) {
        if ('token' in data) {
            this.tempToken = data.token;
            localStorage.setItem(environment.accessTokenParam, data.token);
        }
        return this;
    }

    setActions(data: any) {
        const stringActions = data;
        this.tempActions = stringActions;
        localStorage.setItem('actions', stringActions);
    }

    setUserActions(data: any) {
        if ('actions' in data) {
            // const secureLS = new SecureLS({ encodingType: 'aes', isCompression: false, encryptionSecret: this.ENCRYPTION_KEY });
            // secureLS.set('actions', JSON.stringify(data));
            localStorage.setItem('actions', JSON.stringify(data.actions));
        }
        return this;
    }

    setDefaultPath(data: any) {
        if (data && 'actions' in data) {
            if (data.actions[0] && 'defaultPath' in data.actions[0]) {
                this.setLocalPath(data.actions[0].defaultPath);
            }
        } else {
            if (data) {
                this.setLocalPath(data[0].defaultPath);
            }
        }
        return this;
    }

    setLocalPath(defaultPath) {
        localStorage.setItem('defaultPath', defaultPath);
    }
    getDefaultPath() {
        try {
            if (this.tempDefaultPath) {
                this.setDefaultPath(this.decodeActions());
                return this.tempDefaultPath;
            }

            if (!this.tempDefaultPath) {
                this.setDefaultPath(this.decodeActions());
            }
            const defaultPath: string = <string>localStorage.getItem('defaultPath');
            this.tempDefaultPath = defaultPath;
            return defaultPath;
        } catch (err) {
            console.log(err);
            return null;
        }
    }
    /**
       * Set refresh token
       * @returns {TokenStorage}
       */
    /* public setBearerToken(data: any): void {
        if ('bearer' in data) {
            localStorage.setItem(environment.bearerTokenParam, data.bearer);
        }
    } */

    /**
       * Set user roles
       * @param userInfo
       * @returns {TokenStorage}
       */
    public setUserInfo(userInfo: User): any {
        if (userInfo != null) {
            const secureLS = new SecureLS({ encodingType: 'aes', isCompression: false, encryptionSecret: this.ENCRYPTION_KEY });
            secureLS.set(environment.userInfo, JSON.stringify(userInfo));
        }
        return this;
    }

    public getUserInfo() {

        try {
            const secureLS = new SecureLS({ encodingType: 'aes', isCompression: false, encryptionSecret: this.ENCRYPTION_KEY });
            const userInfo = secureLS.get(environment.userInfo);
            if (userInfo) {
                return JSON.parse(userInfo);
            }
        } catch (err) {
            console.log('error in parsing', err);
            this.clear();
            this.router.navigate(['/login']);
        }
    }

    public setUserRoleID(roleId: number): any {
        if (roleId != null) {
            const objUserInfo = this.getUserInfo();
            objUserInfo.roleId = roleId;
            this.setUserInfo(objUserInfo);
        }
        return this;
    }

    public removeKey<T>(key) {
        localStorage.removeItem(key);
    }

    public setRouteData(key, value) {
        if (value) {
            return localStorage.setItem(key, value);
        }
        return null;
    }

    public getRouteData() {
        return JSON.parse(localStorage.getItem('routes'));
    }

    decodeUserFromToken() {
        return this.jwtHelper.decodeToken(this.getAccessToken());
    }

    decodeActions(): Menu[] {
        try {
            return JSON.parse(this.getActions());
        } catch (err) {
            this.clear();
            this.router.navigate(['/login']);
        }
    }
    /**
       * Remove tokens
       */
    public clear() {
        localStorage.removeItem(environment.accessTokenParam);
        localStorage.clear();
        this.tempToken = null;
        this.tempActions = null;
        this.tempDefaultPath = null;
    }

    getLocalData(key) {
        return localStorage.getItem(key);
    }
}