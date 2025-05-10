import { Component } from '@angular/core';
import { ApiService } from '../../services/app.service'; 
import { Router } from '@angular/router';

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
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  nombre: string = '';
  apellido: string = '';
  correo: string = '';
  contrasena: string = '';
  tipo_user: number = 1;
  error: string = '';
  users: User[] = []; 

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.api.getUser().subscribe({
      next: (res) => {
        this.users = res.data;
        console.log('user:', this.users);
      },
      error: (err) => {
        console.error('Error al obtener user', err);
      }
    });
  }

  crearUsuario() {
    this.api.create_user(this.nombre, this.apellido, this.correo, this.contrasena, this.tipo_user).subscribe({
      next: () => {
        this.router.navigate(['/login']); 
      },
      error: (err) => {
        console.error('Error al registrar usuario:', err);
        
        if (err.error?.msg) {
          this.error = err.error.msg;
        } else {
          this.error = 'Error al registrar usuario. Inténtalo de nuevo.';
        }
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  gotHome() {
    this.router.navigate(['']);
  }

}
