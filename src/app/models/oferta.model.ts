export class Oferta{
    constructor(
        public id: string,
        public nombre: string,
        public precio: number,
        public puntos: number,
        public oferta: number,
        public stock: number,
        public imagenUrl: string,
        public creado: Date,
        public modificado: Date,
    ){}
}
export interface OfertaData{
    nombre: string,
    precio: number,
    puntos: number,
    oferta: number,
    stock: number,
    imagenUrl: string,
    creado: Date,
    modificado: Date,
}