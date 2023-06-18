import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor( public auth: AuthService, private router: Router) {
    
  }

  googleLogin() {
    this.auth.googleLogin().then(t => {
      this.router.navigate(['dashboard']);
    });
  }

  notAvailable() {
    alert('Registration coming soon...please continue whit Google Login');
  }
}