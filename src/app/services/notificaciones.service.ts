import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Notificacion } from '../models/notificacion.model';

@Injectable({
    providedIn: 'root'
})
export class NotificacionesService {

    private _collection = 'users';
    private _subcollection = 'notifications';
    private _notificacion:Notificacion;

    get notificacion() {
        return this._notificacion;
    }
    constructor(private firestore: AngularFirestore){}

    getItem(uid: string, id:string)
    {
        return this.firestore.collection(this._collection).doc(uid).collection(this._subcollection).doc(id).get();
    }
    fetchItems(uid: string)
    {
        return this.firestore.collection(this._collection).doc(uid).collection(this._subcollection, ref=> ref.orderBy('creado', 'desc')).valueChanges();
    }
    createItem(uid:string, pedido:string)
    {
        return this.firestore.collection(this._collection).doc(uid).collection(this._subcollection).add({
            creado: new Date().getTime(),
            modificado: new Date().getTime(),
            estado: 'P',
            idPedido: pedido
        });
    }
    updateItem(uid:string, id:string, estado: string)
    {
        return this.firestore.collection(this._collection).doc(uid).collection(this._subcollection).doc(id).update({
           modificado: new Date().getTime(),
           estado: estado
        });
    }
    deleteItem(uid:string, id:string)
    {
        return this.firestore.collection(this._collection).doc(uid).collection(this._subcollection).doc(id).delete();
    }
}