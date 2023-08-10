import { Component, OnInit, Input } from '@angular/core';
import { ShoppingCart } from 'src/app/models/shopping-cart.model';
import { CartService } from 'src/app/services/cart.service';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-item-cantidad',
  templateUrl: './item-cantidad.component.html',
  styleUrls: ['./item-cantidad.component.scss'],
})
export class ItemCantidadComponent implements OnInit {

  @Input('producto') producto: any = {} as any;
  @Input('shopping-cart') shoppingCart = {} as ShoppingCart;
  @Input('msg') msg = 'in Cart';
  @Input() oferta: boolean;
  @Input() usuario: Usuario;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
  ) { }

  ngOnInit() 
  {
  }

  addToCart() 
  {
    if(this.oferta)
    {
      this.usuario.puntos = this.usuario.puntos - this.producto.puntos;
      this.authService.updatePuntos(this.usuario).then(()=>{
        this.producto.precio = this.producto.oferta;
        this.cartService.addToCart(this.producto);
      });
    }else{
      this.cartService.addToCart(this.producto);
    }
  }
  removeFromCart() 
  {
    if(this.oferta){
      this.usuario.puntos = this.usuario.puntos + this.producto.puntos;
      this.authService.updatePuntos(this.usuario).then(()=>{
        this.cartService.removeFromCart(this.producto);
      });
    }else{
      this.cartService.removeFromCart(this.producto);
    }
  }

}
