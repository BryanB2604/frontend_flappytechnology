import { Component } from '@angular/core';
import { ApiService } from '../../services/app.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent {

  correo: string = '';
  contrasena: string = '';
  error: string = '';

  mostrarModalRecuperacion: boolean = false;
  correoRecuperacion: string = '';
  mensaje: string = '';
  errorRecuperacion: string = '';

  // Para notificación toast
  notificacion: string = '';
  mostrarNotificacion: boolean = false;

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
      setTimeout(() => {
        this.errorRecuperacion = '';
      }, 5000);
      return;
    }

    this.api.solicitarRecuperacion({ email: this.correoRecuperacion }).subscribe({
      next: (res) => {
        // Mostrar mensaje dentro del modal
        this.mensaje = 'Se ha enviado el link para recuperar la contraseña a tu correo.';
        this.errorRecuperacion = '';

        // Mostrar notificación toast fuera del modal
        this.mostrarToast('Se ha enviado el link para recuperar la contraseña a tu correo.');

        // Cerrar modal después de mostrar la notificación (opcional)
        this.cerrarModalRecuperacion();
      },
      error: () => {
        this.errorRecuperacion = 'No se pudo enviar el correo. Intenta nuevamente.';
        this.mensaje = '';
        setTimeout(() => {
          this.errorRecuperacion = '';
        }, 5000);
      }
    });
  }

  cerrarModalRecuperacion() {
    this.mostrarModalRecuperacion = false;
    this.mensaje = '';
    this.errorRecuperacion = '';
    this.correoRecuperacion = '';
  }

  mostrarToast(mensaje: string) {
    this.notificacion = mensaje;
    this.mostrarNotificacion = true;
    setTimeout(() => {
      this.mostrarNotificacion = false;
      this.notificacion = '';
    }, 5000);
  }
}
