import { DetallePedido } from './detallepedido.model';

export class Pedido{  
    id: string;
    idCliente:string;
    nombreCliente: string;
    fechaEntrega: Date;
    total: number;
    entregado: boolean;
    creado: Date;
    modificado: Date;
    detalle: DetallePedido[];

    constructor(
        id:string,
        idCliente:string,
        nombreCliente: string,
        fechaEntrega: string,
        total: number,
        estado: string,
        creado: Date,
        modificado: Date
    ){}
}