import { Component , SecurityContext} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/login/auth.service';
import { PinGuard } from '../../guards/pin.guard';  // Import PinGuard
import { environment} from './../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';  // Import necessary classes for DOM sanitization

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent {
  username: string = '';
  password: string = '';
  loginError: string | null = null;
  showPinModal: boolean = false;  // Flag to control modal visibility
  isLoading: boolean = false;
  passwordVisible: boolean = false;
  pinVerified: boolean = false;
  constructor(
    private pinGuard: PinGuard,
    private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer  // Inject the DomSanitizer
  ) {
    // Check if already logged in and redirect to homepage
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/homepage']);
    }
  }

  login() {

    this.isLoading = true;

    // Simulate a 10-second delay for the loading state
    setTimeout(() => {
      // Your login logic goes here
      this.isLoading = false;
      // Optionally, handle login success or error here
    }, 12000); //
    // Sanitize username and password to prevent XSS and other injection attacks
    const sanitizedUsername = this.sanitizer.sanitize(SecurityContext.HTML, this.username);
    const sanitizedPassword = this.sanitizer.sanitize(SecurityContext.HTML, this.password);

    // Use sanitized data for login
    this.authService.login(sanitizedUsername!, sanitizedPassword!).subscribe(
      success => {
        if (success) {
          console.log('Login successful'); // Log success
          this.router.navigate(['/homepage']); // Redirect to home or another page
        } else {
          //console.log('Login failed, invalid credentials'); // Log invalid credentials case
          this.loginError = 'Invalid credentials. Please try again.';
        }
      },
      error => {
        console.error('Login failed due to error:', error); // Log the error message
        this.loginError = error; // Display the error message returned from the service
      }
    );
  }
// Custom username validation to avoid special characters and quotes
validateUsername() {
  const usernamePattern = /^[A-Za-z0-9_ ]*$/; // Allow only letters, numbers, and underscores
  if (!usernamePattern.test(this.username)) {
    this.username = this.username.replace(/[^A-Za-z0-9_ ]/g, ''); // Remove invalid characters
  }
}

// Custom password validation: must contain at least 3 numbers and no special characters or quotes
validatePassword() {
  const passwordPattern = /^[A-Za-z0-9]*$/; // Allow only letters and numbers
  const numberCount = (this.password.match(/\d/g) || []).length; // Count digits
  if (!passwordPattern.test(this.password)) {
    this.password = this.password.replace(/[^A-Za-z0-9]/g, ''); // Remove invalid characters
  }
  if (numberCount < 3) {
    // Add logic to show error when password doesn't have 3 numbers
  }
}
  // When the user clicks "Sign Up", show the PIN modal
  onSignUpClick() {
    this.showPinModal = true;  // Show the PIN modal
  }

 // Handle the result of the PIN verification
 onPinVerified(isVerified: boolean) {
  if (isVerified) {
    this.pinVerified = true;
    this.pinGuard.setPin(environment.secretPin);  // Store the correct PIN
    this.showPinModal = false;  // Close the PIN modal
    this.router.navigate(['/signup']);  // Navigate to signup page
  } else {
    this.pinVerified = false;
    this.showPinModal = true;  // Keep the modal open for re-entry
  }
}
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
}
