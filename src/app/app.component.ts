import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from "./sidebar/sidebar.component";
import { AuthService } from './services/auth.service';
import { User } from '@angular/fire/auth';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, HeaderComponent, FooterComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'budget-tracker';
  authService = inject(AuthService);  
  user: User | null = null;
  ngOnInit(): void {
    this.authService.getUser().subscribe((user:User) => {
      this.user = user;
    });
  }

}
