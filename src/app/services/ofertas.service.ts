import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Oferta, OfertaData } from '../models/oferta.model';

@Injectable({
    providedIn: 'root'
})
export class OfertasService
{
    private _ofertas = new BehaviorSubject<Oferta[]>([]);
    private _puntos = new BehaviorSubject<number>(0);
    private  url = 'https://pedidos-hayai.firebaseio.com';

    get ofertas()
    {
        return this._ofertas.asObservable();
    }
    get puntos()
    {
        return this._puntos.asObservable();
    }
    constructor(private http: HttpClient) { }

    updatePuntos(puntos:number)
    {
        this._puntos.next(puntos);
    }

    fetchItems()
    {
        return this.http.get<{[key:string]: OfertaData}>(this.url + '/ofertas.json').pipe(
            take(1),
            map(resData => {
                const items = [];
                for(const key in resData)
                {
                  if(resData.hasOwnProperty(key))
                  {
                    items.push(new Oferta(
                      key,
                      resData[key].nombre,
                      resData[key].precio,
                      resData[key].puntos,
                      resData[key].oferta,
                      resData[key].stock,
                      resData[key].imagenUrl,
                      new Date(resData[key].creado),
                      new Date(resData[key].modificado),
                    ));
                  }
                }
                return items;
            }),
            tap(items => {
                this._ofertas.next(items);
            })
        );
    }
    getItem(id: string)
    {
        return this.http.get<OfertaData>(this.url + `/ofertas/${id}.json`).pipe(
            map(data=>{
                return new Oferta(
                    id,
                    data.nombre,
                    data.precio,
                    data.puntos,
                    data.oferta,
                    data.stock,
                    data.imagenUrl,
                    new Date(data.creado),
                    new Date(data.modificado)
                );
            })
        );
    }
}