import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapService } from '../services/map.service';
import { Router } from '@angular/router';
import { Subscription, BehaviorSubject } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { CartComponent } from '../shared/cart/cart.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy{

  titulo:string = 'Inicio';
  sub$: Subscription;
  cartItemCount: BehaviorSubject<number>;

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  constructor(
    private mapService: MapService,
    private router: Router,
    private modalCtrl: ModalController,
  ) {}

  ngOnInit()
  {

  }
  ionViewWillEnter()
  {
    this.sub$ = this.mapService.getMapData().subscribe(mapData => {
      if(mapData == null)
      {
        this.router.navigate(['/ubicacion']);
        return;
      }
      this.titulo = mapData.direccion;
    });
  }
  async abrirCarrito()
  {
    //this.router.navigate(['/cart']);
    let modal = await this.modalCtrl.create({
      component: CartComponent
    });
    modal.present();
  }
  ngOnDestroy()
  {
    if(this.sub$ != null)
    {
      this.sub$.unsubscribe();
    }
  }
}
