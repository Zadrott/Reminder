import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map, shareReplay } from 'rxjs';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    RouterLink,
    AsyncPipe,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  hidePasswords = true;
  isRegistering = false;
  error = '';

  loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(6), Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    const { email, password } = this.loginForm.getRawValue();

    console.log('Submit:', this.loginForm.value);

    this.authService.login(email, password).subscribe({
      next: (res) => {
        console.log('logged in successfully !', res);
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        console.error(err);

        if (err.status == 401) {
          this.snackBar.open('Incorrect email or password', 'Dismiss', {
            duration: 8000,
          });
        } else {
          this.snackBar.open(err.message, 'Dismiss', {
            duration: 12000,
          });
        }

        this.error = err.statusText;
      },
    });
  }

  register() {
    console.log('Register:', this.loginForm.value);

    const { email, password } = this.loginForm.getRawValue();
    this.authService.register(email, password).subscribe();
  }

  onRegistering() {
    this.isRegistering = true;
    this.error = '';
  }

  onBackToLogIn() {
    this.isRegistering = false;
    this.error = '';
  }
}
