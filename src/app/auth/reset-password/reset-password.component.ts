import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/app.service';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  nuevaContrasena: string = '';
  confirmarContrasena: string = '';
  token: string = '';
  mensaje: string = '';
  error: string = '';

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.error = 'Token inválido o expirado.';
    }
  }

  resetearContrasena() {
    if (!this.nuevaContrasena || !this.confirmarContrasena) {
      this.error = 'Por favor llena todos los campos.';
      return;
    }

    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.api.resetearContrasena({ token: this.token, nuevaContrasena: this.nuevaContrasena }).subscribe({
      next: (res) => {
        this.mensaje = res.msg;
        this.error = '';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: () => {
        this.error = 'Error al resetear la contraseña.';
        this.mensaje = '';
      }
    });
  }
}
