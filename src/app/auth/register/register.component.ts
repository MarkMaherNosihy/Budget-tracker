import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, InputTextModule, ButtonModule, FloatLabel],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  successMessage = '';
  private router = inject(Router);
  private firestore:Firestore = inject(Firestore)

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validator: this.matchPasswords('password', 'confirmPassword') });
  }

  // Custom validator to match passwords
  matchPasswords(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passControl = formGroup.controls[password];
      const confirmPassControl = formGroup.controls[confirmPassword];

      if (confirmPassControl.errors && !confirmPassControl.errors['mismatch']) {
        return;
      }

      if (passControl.value !== confirmPassControl.value) {
        confirmPassControl.setErrors({ mismatch: true });
      } else {
        confirmPassControl.setErrors(null);
      }
    };
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }
    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;


    this.authService.signUp(email, password)
    .then((user) => {
      const usersCollection = collection(this.firestore, 'users');
      addDoc(usersCollection, { email: email, uid: user.user.uid }).then(() => {
        console.log('User added to firestore');
        this.successMessage = 'User registered successfully';
      }
      ).catch((error) => {
        console.error('Error adding user to firestore', error);
      this.successMessage = 'Error registering user';

      });
      this.registerForm.reset();
      this.router.navigate(['/dashboard']);

    }).catch((error:any) => {
      this.registerForm.reset();
      this.successMessage = 'Error registering user';
    });
  }
  
  get f() {
    return this.registerForm.controls;
  }
}
