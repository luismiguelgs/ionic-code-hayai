import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { Oferta } from 'src/app/models/oferta.model';
import { Subscription, Observable, of } from 'rxjs';
import { ShoppingCart } from 'src/app/models/shopping-cart.model';
import { OfertasService } from 'src/app/services/ofertas.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { CartComponent } from 'src/app/shared/cart/cart.component';

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.page.html',
  styleUrls: ['./ofertas.page.scss'],
})
export class OfertasPage implements OnInit {

  items: Oferta[];
  goalItems: Oferta[];
  private sub$: Subscription;
  cart$: Observable<ShoppingCart>;
  usuario: Usuario;
  puntos: number;

  constructor(
    private cartService: CartService,
    private itemsService: OfertasService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private router: Router,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getCart();
    this.getItems();
  }
  async getCart()
  {
    (await this.cartService.getCart()).subscribe(data => {
      const cart = data.map(e => {
        return {
            id: e.payload.doc.id,
            nombre: e.payload.doc.data()['nombre'],
            imagenUrl: e.payload.doc.data()['imagenUrl'],
            precio: e.payload.doc.data()['precio'],
            cantidad: e.payload.doc.data()['cantidad'],
        }
      });
      this.cart$ = of(new ShoppingCart(cart))
    });
  }
  getItems()
  {
    this.sub$ = this.itemsService.ofertas.subscribe(items =>{
      this.items = items;
      this.goalItems = items;
    });
  }
  ionViewWillEnter()
  {
    this.puntos
    this.loadingCtrl.create({
      message: 'Cargando...'
    }).then(loadingEl =>{
      loadingEl.present();
      this.itemsService.fetchItems().subscribe(()=>{
        this.getUser();
        this.cartService.getCart();
        loadingEl.dismiss();
      });
    });
  }
  getUser()
  {
    this.authService.getUserUidLocal().subscribe(uid=> {
      if(uid)
      {
        this.authService.getUser(uid).subscribe(doc=> {

          this.usuario = new Usuario();
          this.usuario.uid = uid;
          this.usuario.puntos = doc.data().puntos;
        });
      }
      else
      {
        this.usuario = new Usuario();
        this.usuario.puntos = 0;
        this.puntos = 0;
      }
    });
  }
  async abrirCarrito()
  {
    let modal = await this.modalCtrl.create({
      component: CartComponent
    });
    modal.present();
  }
  initializeItems(): void
  {
    this.goalItems = this.items;
  }
  filterList(event: any)
  {
    this.initializeItems();
    const searchTerm = event.srcElement.value;
    if(!searchTerm)
    {
      return;
    }
    this.goalItems = this.goalItems.filter(currentGoal => {
      if(currentGoal.nombre && searchTerm){
        if(currentGoal.nombre.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
        {
          return true;
        }
        return false;
      }
    });
  }
  ngOnDestroy()
  {
    if(this.sub$)
    {
      this.sub$.unsubscribe();
    }
  }
}
