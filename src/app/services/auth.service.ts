import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    collection = 'users';
    _usuario:Usuario;

    get usuario() {
        return this._usuario;
    }
    constructor(private firestore: AngularFirestore){}

    getUser(uid:string)
    {
        return this.firestore.collection(this.collection).doc(uid).get();
    }
    createUser(usuario:Usuario)
    {
        return this.firestore.collection(this.collection).doc(usuario.uid).set({
            uid: usuario.uid,
            nombre: usuario.nombre.toUpperCase(),
            telefono: usuario.telefono,
            ubicacion: usuario.ubicacion,
            puntos: usuario.puntos, //primera compra
            creado: new Date().getTime(),
            modificado: new Date().getTime()
        });
    }
    updateUser(usuario:Usuario)
    {
        return this.firestore.collection(this.collection).doc(usuario.uid).update({
            nombre: usuario.nombre.toUpperCase(),
            ubicacion: usuario.ubicacion,
            telefono: usuario.telefono,
            modificado: new Date().getTime()
        });
    }
    updatePuntos(usuario: Usuario)
    {
        return this.firestore.collection(this.collection).doc(usuario.uid).update({
            puntos: usuario.puntos
        });
    }
    setUserUidLocal(usuario:Usuario)
    {
        Plugins.Storage.set({key: 'usuariouid', value: usuario.uid});
    }
    deleteUserUidLocal()
    {
        Plugins.Storage.remove({key: 'usuariouid'});
    }
    getUserUidLocal()
    {
        return from(Plugins.Storage.get({key: 'usuariouid'}).then(storedData => {
            if(!storedData || !storedData.value)
            {
              return null;
            }
            const parsedData = storedData.value;
            return parsedData;
        }));
    }
}