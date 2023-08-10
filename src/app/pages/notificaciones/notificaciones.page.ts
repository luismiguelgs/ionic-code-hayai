import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { CartComponent } from 'src/app/shared/cart/cart.component';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {

  debug = false;
  sub$: Subscription;
  notificaciones: any;
  mensaje: string;

  constructor(
    private mapService: MapService,
    private authService: AuthService,
    private cartService: CartService,
    private notificacionesService: NotificacionesService,
    private loadingCtrl: LoadingController,
    public utilService: UtilService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() 
  {
  }
  ionViewWillEnter()
  {
    this.getNotificaciones();
  }
  async getNotificaciones()
  {
    this.loadingCtrl.create({message: 'Cargando...'}).then(loadingEl=>{
      loadingEl.present();
      this.authService.getUserUidLocal().subscribe(uid=>{
        if(uid)
        {
          try{
            this.notificacionesService.fetchItems(uid).subscribe(data => {
              this.notificaciones = data;
            loadingEl.dismiss();
            });
          }
          catch(e)
          {
            console.log(e);
          }
        }else{
          this.mensaje = "Usuario no existe, realizar su primera compra";
          loadingEl.dismiss();
        }
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
  verCarrito(id:string):void
  {
    console.log(id);
  }
  deleteMap()
  {
    this.mapService.deleteMapData();
    console.log("mapa borrado");
  }
  deleteUsuario()
  {
    this.authService.deleteUserUidLocal();
    console.log("usuario borrado");
  }
  deleteCart()
  {
    this.cartService.deleteCartLocal();
  }
}
