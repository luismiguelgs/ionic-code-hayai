import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { Producto } from '../../models/producto.model';
import { Subscription, Observable, of } from 'rxjs';
import { ShoppingCart } from '../../models/shopping-cart.model';
import { CartService } from '../../services/cart.service';
import { CartComponent } from '../../shared/cart/cart.component';

@Component({
  selector: 'app-seccion',
  templateUrl: './seccion.page.html',
  styleUrls: ['./seccion.page.scss'],
})
export class SeccionPage implements OnInit, OnDestroy {

  titulo = 'Cargando...';
  seccion: string;
  items: Producto[];
  goalItems: Producto[];
  private sub$: Subscription;
  cart$: Observable<ShoppingCart>;

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private itemsService: ProductosService,
    private cartService: CartService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() 
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

    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('seccion'))
      {
        this.router.navigate(['/tabs/inicio']);
        return;
      }
      this.seccion = paramMap.get('seccion')
      switch (this.seccion)
      {
        case 'bebidas':
          this.titulo = 'Agua y Bebidas';
          break;
        case 'abarrotes':
          this.titulo = 'Abarrotes';
          break;
        case 'limpieza':
          this.titulo = 'Limpieza';
          break;
        case 'higiene':
          this.titulo = 'Cuidado Personal';
          break;
      }
      this.sub$ = this.itemsService.productos.subscribe(items =>{
        this.items = items;
        this.goalItems = items;
      });
    });
  }
  ionViewWillEnter()
  {
    this.loadingCtrl.create({
      message: 'Cargando...'
    }).then(loadingEl =>{
      loadingEl.present();
      this.itemsService.fetchItems(this.seccion.toUpperCase()).subscribe(()=>{
        this.cartService.getCart().then(()=>{
          loadingEl.dismiss();
        });
      });
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
