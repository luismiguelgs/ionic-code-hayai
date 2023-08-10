import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Ubicacion } from '../models/ubicacion.model';
import { map } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private _ubicacion: Ubicacion = {
    lat: null,
    lng: null,
    direccion: null,
    staticMapImageUrl: null,
  };

  get ubicacion() : Ubicacion{
    return this._ubicacion;
  }
  set ubicacion(ubicacion: Ubicacion) {
    this._ubicacion = ubicacion;
    this.storeMapData(this._ubicacion);
  }
  constructor(
    private alertCtrl: AlertController,
    private http: HttpClient
  ) { }

  public getAddress(lat: number, lng: number)
  {
    return this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsApiKey}`).pipe(map(geoData => {
      if(!geoData || !geoData.results || geoData.results.length == 0)
      {
        return null;
      }
      return geoData.results[0].formatted_address;
    }));
  }
  public getMapImage(lat: number, lng: number, zoom: number)
  {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}&key=${environment.googleMapsApiKey}`
  }
  storeMapData(ubicacion: Ubicacion)
  {
    const data = JSON.stringify({
      lat: ubicacion.lat,
      lng: ubicacion.lng,
      direccion: ubicacion.direccion,
      staticMapImageUrl: ubicacion.staticMapImageUrl,
    });
    Plugins.Storage.set({key: 'mapData', value: data});
  }
  getMapData()
  {
    return from(Plugins.Storage.get({key: 'mapData'}).then(storedData => {
      if(!storedData || !storedData.value)
      {
        return null;
      }
      const parsedData = JSON.parse(storedData.value) as Ubicacion;
      return parsedData;
    }));
  }
  deleteMapData()
  {
    Plugins.Storage.remove({key: 'mapData'});
  }
  public showErrorAlert()
  {
    this.alertCtrl.create({
      header: 'No se puede conseguir ubicación',
      message: 'Please use the map to pick a location!',
      buttons: ['Okay']
    }).then(alertEl => {
      alertEl.present();
    });
  }
}
