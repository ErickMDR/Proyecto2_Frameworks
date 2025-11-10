import { Injectable } from '@angular/core';
import { User } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USERS_KEY = 'timeVisualizer_users';
  private currentUser: User | null = null;

  constructor() {
    const savedUser = localStorage.getItem('timeVisualizer_currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  register(username: string, password: string): boolean {
    const users = this.getUsers();
    
    if (users.find(u => u.username === username)) {
      return false;
    }

    const newUser: User = { username, password };
    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    
    this.login(username, password);
    return true;
  }

  login(username: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      this.currentUser = user;
      localStorage.setItem('timeVisualizer_currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('timeVisualizer_currentUser');
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  private getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }
}