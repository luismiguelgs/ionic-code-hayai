import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class UtilService {

    private diasEntrega = 2;

    private _estadosPedido: any[]=[
        {value:'P', nombre:'Registrado', mensaje:'Pedido registrado exitosamente.'},
        {value:'E', nombre:'En camino', mensaje:'Su pedido ha sido cargado y esta en camino.'},
        {value:'C', nombre:'Completado', mensaje:'Su pedido ha sido entregado.'}
    ];

    constructor() {}

    public sumarDias(fecha: Date)
    {
        fecha.setDate(fecha.getDate() + this.diasEntrega);
        return fecha;
    }
    public estadoPedido(estado: string)
    {
        switch (estado) {
            case 'P':
                return this._estadosPedido[0];
            case 'E':
                return this._estadosPedido[1];
            case 'C':
                return this._estadosPedido[2];
            default:
                break;
        }
    }
}