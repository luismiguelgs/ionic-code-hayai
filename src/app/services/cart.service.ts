import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Producto } from '../models/producto.model';
import { ShoppingCart } from '../models/shopping-cart.model';
import { Plugins } from '@capacitor/core'; //usar

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private _puntos: number;
  private _cartItemCount = new BehaviorSubject(0);
  private collection = 'shopping-cart';

  get puntos(){
    return this._puntos;
  }
  set puntos(puntos: number){
    this._puntos = puntos;
  }
  constructor(
    private firestore: AngularFirestore
    ) {}

  async addToCart(producto:Producto)
  {
    this.updateItemQty(producto, 1);
  }
  async removeFromCart(producto:Producto)
  {
    this.updateItemQty(producto, -1);
  }
  async getCartId()
  {
    let cartId = await this.getOrCreateCartId();
    return cartId;
  }
  async getCart()
  {
    let cartId = await this.getOrCreateCartId();
    return this.firestore.collection<ShoppingCart>(this.collection).doc(cartId).collection('items').snapshotChanges()
  }
  async updateItemQty(producto: Producto, cambio: number)
  {
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId, producto.id);

    let updatedQty: number;

    item$.subscribe(item => {
      if(item.data() != null)
      {
        updatedQty = item.data()['cantidad'] + cambio;
      }
      else{
        updatedQty = cambio;
      }
      if(updatedQty <= 0)
      {
                this.removeItem(cartId, item.id);
      }else{
                this.updateItem(cartId, producto, updatedQty);
            }

    });
  }
  private async getOrCreateCartId():Promise<string>
  {
    let cartId = localStorage.getItem('cartId');
    if(cartId) return cartId;
        
    let cart = await this.createCardId();

    cartId = localStorage.getItem('cartId');
    if(cartId) return cartId;

    localStorage.setItem('cartId', cart.id);
    return cart.id;
  }
  private createCardId() 
  {
      return this.firestore.collection(this.collection).add({
          creado: new Date().getTime(),
          estado: 'I'
      });
  }
  private updateItem(cardId: string, producto: Producto, cantidad)
  {
      return this.firestore.collection(this.collection).doc(cardId).collection('items').doc(producto.id).set({
          nombre: producto.nombre,
          imagenUrl: producto.imagenUrl,
          precio: producto.precio,
          cantidad: cantidad,
          oferta: producto.oferta || 0
      });
  }
  private getItem(cartId: string, key: string)
  {
    return this.firestore.collection('shopping-cart').doc(cartId).collection('items').doc(key).get();
  }
  private removeItem(cartId: string, key: string)
  {
    this.firestore.collection('shopping-cart').doc(cartId).collection('items').doc(key).delete();
  }
  async clearAllCart()
  {
    let cartId = await this.getOrCreateCartId();
    return this.firestore.collection('shopping-cart').doc(cartId).delete();
  }
  async updateCart(pago:string, nombre:string, userId:string, fechaEntrega: Date)
  {
    let cartId = await this.getOrCreateCartId();
    return this.firestore.collection(this.collection).doc(cartId).update({
      modificado: new Date().getTime(),
      fechaEntrega: fechaEntrega.getTime(),
      pago: pago,
      estado: 'P',
      user: userId,
      nombreCliente: nombre.toUpperCase()
    })
  }
  deleteCartLocal()
  {
    localStorage.removeItem('cartId');
  }
}
