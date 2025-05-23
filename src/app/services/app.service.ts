import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://back-node-flappytechnology-production.up.railway.app';

  constructor(private http: HttpClient) { }

  // Endpoints User
  // Login
  login(correo: string, contrasena: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios/login`, {
      correo,
      contrasena
    });
  }

  // Crear usuario y solicitar verificación
  create_user_validacion(nombre: string, apellido: string, correo: string, contrasena: string, tipo_user: number): Observable<any> {
    const body = { nombre, apellido, correo, contrasena, tipo_user };
    return this.http.post<any>(`${this.baseUrl}/auth/solicitar-verificacion`, body);
  }

  create_user_configuracion(token: string, codigo: string): Observable<any> {
    const body = { token: token.trim(), codigoIngresado: codigo.trim() };
    console.log('BODY para enviar:', body);
    return this.http.post<any>(`${this.baseUrl}/auth/verificar-codigo`, body);
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

  // Eliminar User
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/usuarios/deleteusuariobyid/${id}`);
  }

  solicitarRecuperacion(data: { email: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/solicitar-recuperacion`, data);
  }

  resetearContrasena(data: { token: string, nuevaContrasena: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/resetear-contrasena`, data);
  }

  // Buscar producto
  searchUser(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuarios/getusuariobyid/${id}`);
  }

  // Actualizar User
  updateUser(id: number, nombre: string, apellido: string, correo: string, contrasena: string, tipo_user: number): Observable<any> {
    const body = { nombre, apellido, correo, contrasena, tipo_user };
    return this.http.put(`${this.baseUrl}/usuarios/updateusuariobyid/${id}`, body);
  }

  // Obtener todos los productos
  getProduct(): Observable<any> {
    return this.http.get(`${this.baseUrl}/productos/getAllProductos`);
  }

  // Buscat producto
  searchProduct(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/productos/getProductoById/${id}`);
  }

  // Crear producto
  createProduct(nombre: string, descripcion: string, valor_unitario: number, proveedor: string): Observable<any> {
    const body = { nombre, descripcion, valor_unitario, proveedor };
    return this.http.post(`${this.baseUrl}/productos/createProducto`, body);
  }

  // Actualizar producto
  updateProduct(id: number, nombre: string, descripcion: string, valor_unitario: number, proveedor: string, img: string): Observable<any> {
    const body = { nombre, descripcion, valor_unitario, proveedor, img };
    return this.http.put(`${this.baseUrl}/productos/updateProductoById/${id}`, body);
  }

  // Eliminar producto
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/productos/deleteProductoById/${id}`);
  }

  // Obtener todos los productos del front
  getProductFront(): Observable<any> {
    return this.http.get(`${this.baseUrl}/productos/getallProductosToFront`);
  }

  // Crear producto con stock
  createProductSocket(nombre: string, descripcion: string, valor_unitario: number, proveedor: string, img: string, cantidad_total: number, cantidad_disponible: number, cantidad_reservada: number, ultima_actualizacion: string, hora_actualizacion: string): Observable<any> {
    const body = { nombre, descripcion, valor_unitario, proveedor, img, cantidad_total, cantidad_disponible, cantidad_reservada, ultima_actualizacion, hora_actualizacion };
    return this.http.post(`${this.baseUrl}/productos/createProductoConStock`, body);
  }

  // Actualizar producto con Stock
  updateProductSocket(id_prod: number,nombre: string, descripcion: string, valor_unitario: number, proveedor: string, img: string, id_stock:number, cantidad_total: number): Observable<any> {
    const body = {id_prod, nombre, descripcion, valor_unitario, proveedor, img, id_stock, cantidad_total};
    return this.http.put(`${this.baseUrl}/productos/updateProductoConStock`, body);
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
    const body = { fk_user, fk_prod, fk_estado, fecha, hora, cantidad, total, cod_compra };
    return this.http.post(`${this.baseUrl}/ventas/createVenta`, body);
  }

  // Actualizar Venta
  updateSales(id: number, fk_user: number, fk_prod: number, fk_estado: number, fecha: string, hora: string, cantidad: number, total: number, cod_compra: string): Observable<any> {
    const body = { fk_user, fk_prod, fk_estado, fecha, hora, cantidad, total, cod_compra };
    return this.http.put(`${this.baseUrl}/ventas/updateVentaById/${id}`, body);
  }

  // Eliminar venta
  deleteSales(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/ventas/deleteVentaById/${id}`);
  }

  // Obtener todos las socket
  getStock(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stock/getAllStock`);
  }

  // Buscar socket
  searchStock(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/stock/getStockById/${id}`);
  }

  // Crear socket
  createStock(id: number, fk_prod: number, cantidad_total: number, cantidad_disponible: number, cantidad_reservada: number, ultima_actualizacion: string, hora_actualizacion: string): Observable<any> {
    const body = { id, fk_prod, cantidad_total, cantidad_disponible, cantidad_reservada, ultima_actualizacion, hora_actualizacion };
    return this.http.post(`${this.baseUrl}/stock/createStock`, body);
  }

  // Eliminar socket
  deleteStock(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/stock/deleteStockById/${id}`);
  }

  // Actualizae  venta
  updateStock(id: number, fk_prod: number, cantidad_total: number, cantidad_disponible: number, cantidad_reservada: number,ultima_actualizacion: string,hora_actualizacion: string): Observable<any> {
    const body = {
      fk_prod,
      cantidad_total,
      cantidad_disponible,
      cantidad_reservada,
      ultima_actualizacion,
      hora_actualizacion
    };
    return this.http.put(`${this.baseUrl}/stock/updateStockById/${id}`, body);
  }

  // socket
  postReserva(data: any) {
    return this.http.post(`${this.baseUrl}/stock/reservarProductos`, data);
  }

  confirmReserve(code: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/ventas/confirmarVenta/${code}`, {});
  }

  cancelarReserve(code: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/ventas/cancelarVenta/${code}`, {});
  }

}
