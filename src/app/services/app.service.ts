import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://back-node-flappytechnology-production.up.railway.app';

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  getUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuarios/getallusuarios`);
  }

  // Obtener todos los productos
  getProduct(): Observable<any> {
    return this.http.get(`${this.baseUrl}/productos/getAllProductos`);
  }

  // Login
  login(correo: string, contrasena: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios/login`, {
      correo,
      contrasena
    });
  }
}
