import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-form">
        <h2>Iniciar Sesión</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Usuario</label>
            <input type="text" id="username" [(ngModel)]="username" name="username" required>
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" [(ngModel)]="password" name="password" required>
          </div>
          <button type="submit">Ingresar</button>
          <p class="error" *ngIf="error">{{ error }}</p>
          <p class="register-link">
             <a (click)="goToRegister()">Regístrate aquí</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #ffffff 0%, #f8fff0 100%);
  }
  .login-form {
    background: #ffffff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    width: 100%;
    max-width: 400px;
    border: 1px solid #e0e0e0;
    font-family: "Georgia", serif;
  }
  .login-form h2 {
    color: #1a1a1a;
    text-align: center;
    margin-bottom: 1.5rem;
    font-weight: bold;
  }
  .form-group {
    margin-bottom: 1rem;
    font-weight: bold;
  }
  label {
    display: block;
    color: #1a1a1a;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    background: #ffffff;
    color: #1a1a1a;
    font-size: 1rem;
  }
  button {
    width: 100%;
    padding: 0.75rem;
    background: #60A679;
    color: #1a1a1a;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-family: "Georgia", serif;
    font-weight: bold;
  }
  .error {
    color: #ff4444;
    text-align: center;
    margin-top: 1rem;
    padding: 0.5rem;
    background: #ffeaea;
    border-radius: 4px;
  }
  .register-link {
    text-align: center;
    margin-top: 1rem;
    color: #666666;
  }
  .register-link a {
    color: #60A679;
    cursor: pointer;
    text-decoration: none;
    font-weight: bold;
  }
`]
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/dashboard']);
    } else {
      this.error = 'Credenciales incorrectas';
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}