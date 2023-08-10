import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';
import { ItemProductoComponent } from './item-producto/item-producto.component';
import { ItemCantidadComponent } from './item-cantidad/item-cantidad.component';
import { PedidoMinimoComponent } from './pedido-minimo/pedido-minimo.component';
import { CartComponent } from './cart/cart.component';


@NgModule({
    declarations:[
        ItemProductoComponent,
        ItemCantidadComponent,
        PedidoMinimoComponent,
        CartComponent,
    ],
    imports: [
        CommonModule,
        IonicModule
    ],
    exports: [
        ItemProductoComponent,
        ItemCantidadComponent,
        PedidoMinimoComponent,
        CartComponent
    ],
    entryComponents: [
        CartComponent
    ]
})
export class SharedModule{}