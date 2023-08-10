export class ShoppingCartItem {

    id: string;
    nombre: string;
    imagenUrl: string;
    precio: number;
    oferta: number;
    cantidad: number;
  
    constructor(param?: Partial<ShoppingCartItem>) {
      Object.assign(this, param);
    }
  
    get totalPrice() {
      return this.cantidad * this.precio;
    }
  }
  