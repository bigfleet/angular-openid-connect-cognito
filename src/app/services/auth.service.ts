import { Injectable } from '@angular/core';
import { UserManager, UserManagerSettings, User } from 'oidc-client';

@Injectable()
export class AuthService {
  
  private manager = new UserManager(getClientSettings());
  private user: User = null;  

  constructor() { 
    this.manager.getUser().then(user => {
      this.user = user;
    });    
  }
  
  isLoggedIn(): boolean {
      return this.user != null && !this.user.expired;
  }
  
  getClaims(): any {
      return this.user.profile;
  }
  
  getAuthorizationHeaderValue(): string {
      return `${this.user.token_type} ${this.user.access_token}`;
  }
  
  startAuthentication(): Promise<void> {
      return this.manager.signinRedirect();
  }

  completeAuthentication(): Promise<void> {
      return this.manager.signinRedirectCallback().then(user => {
          this.user = user;
      });
  }

}

export function getClientSettings(): UserManagerSettings {
    return {
        authority: 'https://cognito-idp.us-west-2.amazonaws.com/us-west-2_LnOJkFMh5/',
        client_id: '2tsbab02uktn1je2cd9mc2fmci',
        redirect_uri: 'http://localhost:4200/auth-callback',
        post_logout_redirect_uri: 'http://localhost:4200/',
        response_type:"token",
        scope:"openid profile",
        filterProtocolClaims: true,
        loadUserInfo: true
    };
}
