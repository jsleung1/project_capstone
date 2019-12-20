import { Auth0Service } from '../../veriguide-user-service/auth0.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-school-login',
  templateUrl: './school-login.component.html',
  styleUrls: ['./school-login.component.css']
})
export class SchoolLoginComponent implements OnInit {

  constructor( private authService: Auth0Service ) {
  }

  ngOnInit() {
  }


  auth0Login() {
    this.authService.login();
  }

}
