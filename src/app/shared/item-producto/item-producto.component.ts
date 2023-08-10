import { Component, OnInit, Input } from '@angular/core';
import { Producto } from 'src/app/models/producto.model';
import { ShoppingCart } from 'src/app/models/shopping-cart.model';
import { CartService } from 'src/app/services/cart.service';
import { OfertasService } from 'src/app/services/ofertas.service';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-item-producto',
  templateUrl: './item-producto.component.html',
  styleUrls: ['./item-producto.component.scss'],
})
export class ItemProductoComponent implements OnInit {

  @Input() item: any
  @Input() shoppingCart: ShoppingCart;
  @Input('show-actions') showActions = true;
  @Input() oferta: boolean;
  @Input() usuario: Usuario;

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit() 
  {
  }

  agregarAlCarro()
  {
    if(this.oferta){
      this.usuario.puntos = this.usuario.puntos-this.item.puntos
      this.authService.updatePuntos(this.usuario).then(()=>{
        this.item.precio = this.item.oferta;
        this.cartService.addToCart(this.item);
      })
    }
    else{
      this.cartService.addToCart(this.item);
    }
  }
}
