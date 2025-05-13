import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/app.service'; 
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

export interface User {
  id_user: number;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  tipo_user: number;
}

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  error: string = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.registerForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]{1,30}$')]),
      apellido: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]{1,30}$')]),
      correo: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@(gmail\\.com|yahoo\\.com|hotmail\\.com|ecci\\.edu\\.co)$')
      ]),
      contrasena: new FormControl('', [Validators.required, Validators.minLength(4)]),
    });
  }

  crearUsuario() {
    if (this.registerForm?.valid) {
      const { nombre, apellido, correo, contrasena } = this.registerForm.value;
      this.api.create_user(nombre, apellido, correo, contrasena, 1).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error al registrar usuario:', err);
          this.error = err.error?.msg || 'Error al registrar usuario. Inténtalo de nuevo.';
        }
      });
    } else {
      this.error = 'Por favor completa todos los campos correctamente.';
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  gotHome() {
    this.router.navigate(['']);
  }

}
