import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="header">
      <div class="container">
        <div class="user-info">
          <h1>Promo Code Management System</h1>
          <div>
            <span style="margin-right: 20px">Welcome, {{ username }}</span>
            <button class="btn btn-secondary" (click)="logout()">Logout</button>
          </div>
        </div>
        <div class="nav">
          <a routerLink="/promo-codes" routerLinkActive="active">Promo Codes</a>
          <a routerLink="/report" routerLinkActive="active">Reports</a>
        </div>
      </div>
    </div>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent implements OnInit {
  username: string = '';

  constructor(private keycloakService: KeycloakService) {}

  async ngOnInit() {
    this.username = await this.keycloakService.getUsername();
  }

  logout() {
    this.keycloakService.logout(window.location.origin);
  }
}
