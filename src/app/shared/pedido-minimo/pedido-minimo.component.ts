import { Component, OnInit, Input } from '@angular/core';
import { ShoppingCart } from 'src/app/models/shopping-cart.model';

@Component({
  selector: 'app-pedido-minimo',
  templateUrl: './pedido-minimo.component.html',
  styleUrls: ['./pedido-minimo.component.scss'],
})
export class PedidoMinimoComponent implements OnInit {

  @Input() progreso: number;

  constructor() { }

  ngOnInit() {}

  getProgreso(progreso: number)
  {
    if(progreso <= 1)
    {
      return progreso;
    }
    else {
      return 1;
    }
  }

}
