import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { Plugins, Capacitor } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { Coordenadas, Ubicacion } from '../../models/ubicacion.model';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MapService } from '../../services/map.service';
import { Router } from '@angular/router';

declare var google:any;

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.page.html',
  styleUrls: ['./ubicacion.page.scss'],
})
export class UbicacionPage implements OnInit {

  map: any;
  @ViewChild('mapElement', {read: ElementRef, static: false}) mapRef: ElementRef;
  isLoading = false;
  selectedLoactionImage: string;
  direccion: string;
  piso: string;
  coordenadas: Coordenadas;

  constructor(
    private alertCtrl: AlertController,
    private mapService: MapService,
    private router:Router
  ) { }

  ngOnInit() {
  }
  
  ionViewDidEnter()
  {
    this.locateUser();
  }
  private locateUser()
  {
    if(!Capacitor.isPluginAvailable('Geolocation'))
    {
      this.mapService.showErrorAlert();
      return;
    }
    this.isLoading = true;
    Plugins.Geolocation.getCurrentPosition().then(geoPosition => {
      this.coordenadas = {
        lat: geoPosition.coords.latitude,
        lng: geoPosition.coords.longitude
      };
      this.mapService.getAddress(this.coordenadas.lat, this.coordenadas.lng).subscribe(direccion=> {
        this.showMap(this.coordenadas.lat, this.coordenadas.lng);
        this.direccion = direccion.toString();
        this.isLoading = false;
      });
    }).catch(err=> {
      this.mapService.showErrorAlert();
      this.isLoading = false;
    });
  }
  public createPlace()
  {
    if(this.piso)
    {
      this.direccion = this.direccion + " " + this.piso;
    }
    const pickedLocation: Ubicacion = {
      lat: this.coordenadas.lat,
      lng: this.coordenadas.lng,
      direccion: null,
      staticMapImageUrl: null
    };
    this.isLoading = true;
    pickedLocation.direccion = this.direccion;
    of(this.mapService.getMapImage(this.coordenadas.lat, this.coordenadas.lng, 16)).subscribe(staticMapImageUrl => {
      
      pickedLocation.staticMapImageUrl = staticMapImageUrl;
      this.mapService.ubicacion = pickedLocation;
      this.isLoading = false;
      this.router.navigate(['/tabs/inicio']);
    });
  }
  showMap(lat: number, lng: number) 
  {
    const location = new google.maps.LatLng(lat, lng);
    const options = {
      center: location,
      zoom: 18,
      disableDefaultUI: true
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    const pos = {
      lat: lat,
      lng: lng
    }
    this.map.setCenter(pos);
    const icon = {
      url: 'assets/ubicacion.png',
      scaledSize: new google.maps.Size(50,50)
    }
    const marker = new google.maps.Marker({
      position: pos,
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      title: 'Mi Ubicación',
      icon: icon
    });
    //arrastrar el marker
    google.maps.event.addListener(marker, 'dragend', () => {
      this.isLoading = true;
      this.mapService.getAddress(marker.getPosition().lat(), marker.getPosition().lng()).subscribe(direccion=>{
        this.coordenadas = {lat: marker.getPosition().lat(), lng: marker.getPosition().lng()};
        this.direccion = direccion.toString();
        this.map.setCenter(this.coordenadas);
        this.isLoading = false;
      });
    });
  }
}
