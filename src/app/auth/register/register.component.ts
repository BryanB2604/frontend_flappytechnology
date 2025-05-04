import { Component } from '@angular/core';
import { ApiService } from '../../services/app.service'; 
import { Router } from '@angular/router';

export interface User
{
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
        console.log('Productos cargados:', this.users);
      },
      error: (err) => {
        console.error('Error al obtener productos', err);
      }
    });
  }

  crearUsuario(form: any) {
  if (!form.valid) {
    this.error = 'Por favor completa todos los campos.';
    return;
  }

  const usuarioExistente = this.users.find(user => user.correo === this.correo); 
  if (usuarioExistente) {
    this.error = 'El correo ya está registrado';
    return;
  }

  this.api.create_user(this.nombre, this.apellido, this.correo, this.contrasena, this.tipo_user).subscribe({
    next: (res) => {
      console.log("Se creó el usuario correctamente");
      this.router.navigate(['/login']); 
    },
    error: (err) => {
      console.error('Error al registrar usuario:', err);
      this.error = 'Error al registrar usuario';
    }
  });
}

  goToLogin() {
    this.router.navigate(['/login']);
  }

}
