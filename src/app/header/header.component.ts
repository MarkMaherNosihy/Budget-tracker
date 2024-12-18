import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { User } from '@angular/fire/auth';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, ButtonModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  constructor() { }
  authService = inject(AuthService);
  user: User | null = null;
  ngOnInit(): void {
    this.authService.getUser().subscribe((user:User) => {
      this.user = user;
    });
  }

  logout() {
    this.authService.logout();
  }
}
