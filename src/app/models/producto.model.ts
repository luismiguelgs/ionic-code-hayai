export class Producto{
    constructor(
        public id: string,
        public nombre: string,
        public precio: number,
        public familia: string,
        public stock: number,
        public oferta: number,
        public descripcion: string,
        public imagenUrl: string,
        public creado: Date,
        public modificado: Date,
    ){}
}
export interface ProductoData{
    nombre: string,
    precio: number,
    familia: string,
    stock: number,
    oferta: number,
    descripcion: string,
    imagenUrl: string,
    creado: Date,
    modificado: Date,
}