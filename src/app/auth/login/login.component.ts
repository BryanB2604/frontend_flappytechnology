import { Component } from '@angular/core';
import { ApiService } from '../../services/app.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  correo: string = '';
  contrasena: string = '';
  error: string = '';

  mostrarModalRecuperacion: boolean = false;
  correoRecuperacion: string = '';
  mensaje: string = '';
  errorRecuperacion: string = '';

  constructor(private api: ApiService, private router: Router) {}

  iniciarSesion(form: any) {
    if (!form.valid) {
      this.error = 'Por favor completa todos los campos.';
      return;
    }

    this.api.login(this.correo, this.contrasena).subscribe({
      next: (res) => {
        localStorage.setItem('usuario', JSON.stringify(res.data));

        switch (res.data.tipo_user) {
          case 1:
            this.router.navigate(['/user']);
            break;
          case 2:
            this.router.navigate(['/admin']);
            break;
          case 3:
            this.router.navigate(['/superadmin']);
            break;
          default:
            this.error = 'Tipo de usuario no reconocido';
        }
      },
      error: () => {
        this.error = 'Credenciales incorrectas';
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  gotHome() {
    this.router.navigate(['']);
  }

  enviarRecuperacion() {
    if (!this.correoRecuperacion) {
      this.errorRecuperacion = 'Por favor ingresa tu correo.';
      return;
    }

    this.api.solicitarRecuperacion({ email: this.correoRecuperacion }).subscribe({
      next: (res) => {
        this.mensaje = res.msg;
        this.errorRecuperacion = '';
      },
      error: () => {
        this.errorRecuperacion = 'No se pudo enviar el correo. Intenta nuevamente.';
        this.mensaje = '';
      }
    });
  }
}
