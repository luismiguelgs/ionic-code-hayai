import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Producto, ProductoData } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private _productos = new BehaviorSubject<Producto[]>([]);
  private  url = 'https://pedidos-hayai.firebaseio.com';

  get productos()
  {
    return this._productos.asObservable();
  }
  
  constructor(private http: HttpClient) { }

  fetchItems(familia: string)
  {
    return this.http.get<{[key:string]: ProductoData}>(this.url + '/productos.json').pipe(
      take(1),
      map(resData => {
        const items = [];
        for(const key in resData)
        {
          if(resData.hasOwnProperty(key))
          {
            if(resData[key].familia == familia)
            items.push(new Producto(
              key,
              resData[key].nombre,
              resData[key].precio,
              resData[key].familia,
              resData[key].stock,
              resData[key].oferta,
              resData[key].descripcion,
              resData[key].imagenUrl,
              new Date(resData[key].creado),
              new Date(resData[key].modificado),
            ));
          }
        }
        return items;
      }),
      tap(items => {
        this._productos.next(items);
      })
    );
  }
}
