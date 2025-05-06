import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://back-node-flappytechnology-production.up.railway.app';

  constructor(private http: HttpClient) {}

  // Endpoints User
  // Login
  login(correo: string, contrasena: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios/login`, {
      correo,
      contrasena
    });
  }

  // Crear Usuario
  create_user(nombre: string, apellido: string, correo: string, contrasena: string, tipo_user: number) {
    const body = { nombre, apellido, correo, contrasena, tipo_user };
    return this.http.post<any>(`${this.baseUrl}/usuarios/createusuario`, body);
  }

  // Obtener todos los usuarios
  getUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuarios/getallusuarios`);
  }

  // Obtener todos los productos
   getProduct(): Observable<any> {
    return this.http.get(`${this.baseUrl}/productos/getAllProductos`);
  }

  // Obtener todos los productos
  getProductFront(): Observable<any> {
    return this.http.get(`${this.baseUrl}/productos/getallProductosToFront`);
  }

  // Buscat producto
  searchProduct(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/productos/getProductoById/${id}`);
  }

  // Crear producto
  createProduct(nombre: string, descripcion: string, valor_unitario: number, proveedor: string): Observable<any> {
    const body = { nombre, descripcion, valor_unitario, proveedor};
    return this.http.post(`${this.baseUrl}/productos/createProducto`, body);
  }

  // Actualizar producto
  updateProduct(id: number, nombre: string, descripcion: string, valor_unitario: number, proveedor: string): Observable<any> {
    const body = { nombre, descripcion, valor_unitario, proveedor};
    return this.http.put(`${this.baseUrl}/productos/updateProductoById/${id}`,body);
  }

  // Eliminar producto
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/productos/deleteProductoById/${id}`);
  }

  // Obtener todos las ventas
  getSales(): Observable<any> {
    return this.http.get(`${this.baseUrl}/ventas/getAllVentas`);
  }

  // Buscar Ventas
  searchSales(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/ventas/getVentaById/${id}`);
  }

  // Crear venta
  createSales(fk_user: number, fk_prod: number, fk_estado: number, fecha: string, hora: string, cantidad: number, total: number, cod_compra: string): Observable<any> {
    const body = { fk_user, fk_prod, fk_estado, fecha, hora, cantidad, total, cod_compra};
    return this.http.post(`${this.baseUrl}/ventas/createVenta`, body);
  }

  // Actualizar Venta
  updateSales(id: number, fk_user: number, fk_prod: number, fk_estado: number, fecha: string, hora: string, cantidad: number, total: number, cod_compra: string): Observable<any> {
    const body = { fk_user, fk_prod, fk_estado, fecha, hora, cantidad, total, cod_compra};
    return this.http.put(`${this.baseUrl}/ventas/updateVentaById/${id}`,body);
  }
  

  // Eliminar venta
  deleteSales(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/ventas/deleteVentaById/${id}`);
  }

}
