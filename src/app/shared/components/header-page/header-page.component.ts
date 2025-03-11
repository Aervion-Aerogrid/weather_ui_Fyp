import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/login/auth.service';

@Component({
  selector: 'app-header-page',
  templateUrl: './header-page.component.html',
  styleUrls: ['./header-page.component.css']
})
export class HeaderPageComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout(); // Call logout method to set login state to false
    this.router.navigate(['/login']); // Redirect to login page
  }
}
