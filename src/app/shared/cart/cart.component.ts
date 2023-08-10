import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { Observable, of, Subscription } from 'rxjs';
import { ShoppingCart } from '../../models/shopping-cart.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {

  cart$: Observable<ShoppingCart>;
  sub$: Subscription;
  cart: ShoppingCart;
  total: number;
  puntos: number;
  progreso : number;
  constructor(
    private cartService: CartService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getCart();
  }

  async getCart()
  {
    let loader = await this.loadingCtrl.create({
      message: "Cargando..."
    });
    loader.present();
    (await this.cartService.getCart()).subscribe(data => {
      const cart = data.map(e => {
        return {
            id: e.payload.doc.id,
            nombre: e.payload.doc.data()['nombre'],
            imagenUrl: e.payload.doc.data()['imagenUrl'],
            precio: e.payload.doc.data()['precio'],
            cantidad: e.payload.doc.data()['cantidad'],
            oferta: e.payload.doc.data()['oferta']
        }
      });
      this.total = this.getTotal(cart);
      this.cart = new ShoppingCart(cart);
      loader.dismiss();
    });
  }
  decreseCartItem(producto)
  {
    this.cartService.removeFromCart(producto);
  }
  increaseCartItem(producto)
  {
    this.cartService.addToCart(producto);
  }
  removeCartItem(producto)
  {
    //this.cartService.removeProduct(producto);
  }
  getTotal(cart)
  {
    let total = cart.reduce((i,j) => i + j.precio * j.cantidad, 0);
    this.puntos = Math.ceil(total/7);
    this.cartService.puntos = this.puntos;
    this.progreso = total/50;
    return total
    //return this.cart.reduce((i,j) => i + j.precio * j.cantidad, 0);
  }
  close() {
    this.modalCtrl.dismiss();
  }
  checkout()
  {
    this.router.navigate(['/checkout']);
    this.modalCtrl.dismiss();
  }

}
