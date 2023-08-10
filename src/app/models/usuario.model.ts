import { Ubicacion } from './ubicacion.model';

export class Usuario {
    public uid: string;
    public nombre: string;
    public telefono: string;
    public ubicacion: Ubicacion;
    public puntos: number;
    public creado: number;
    public modificado: number;

    constructor(){}
}