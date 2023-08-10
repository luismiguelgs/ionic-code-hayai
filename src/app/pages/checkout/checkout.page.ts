import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AlertController, LoadingController } from '@ionic/angular';
import { MapService } from '../../services/map.service';
import { Ubicacion } from '../../models/ubicacion.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { UtilService } from 'src/app/services/util.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  rechaptchaVerifier;
  confirmationResult: firebase.auth.ConfirmationResult;
  otpSent = false;
  bloquear = false;
  phoneNumber:string;
  ubicacion: Ubicacion;
  user:Usuario;
  usuarioExiste:boolean;
  form: FormGroup;
  puntos: number;

  constructor(
    private afauth: AngularFireAuth,
    private alertCtrl: AlertController,
    private mapService: MapService,
    private router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private loadingCtrl: LoadingController,
    private utilService: UtilService,
    private notificacionService: NotificacionesService
  ) { }

  ngOnInit() 
  {
    //verificar si usuario existe
    this.verificarUsuario();
    this.rechaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {'size': 'invisible'});
    this.conseguirUbicacion();
  }
  conseguirUbicacion()
  {
    this.mapService.getMapData().subscribe(mapData => {
      if(mapData == null)
      {
        this.router.navigate(['/ubicacion']);
        return;
      }
      this.ubicacion = mapData;
    })
  }
  verificarUsuario()
  {
    this.authService.getUserUidLocal().subscribe(uid=> {
      if(uid)
      {
        this.authService.getUser(uid).subscribe(doc=> {
          //TODO asigar a this.user
          this.user = new Usuario();
          this.user.nombre = doc.data().nombre;
          this.user.uid = doc.data().uid;
          this.user.telefono = doc.data().telefono;
          this.user.ubicacion = doc.data().ubicacion;
          this.user.puntos = this.cartService.puntos;

          this.usuarioExiste = true;
          this.otpSent = true
          this.form = new FormGroup({
            nombre: new FormControl(this.user.nombre, {updateOn:'blur', validators: [Validators.required]}),
            pago: new FormControl(null, {updateOn:'blur', validators: [Validators.required]}),
          });
        });
      }else {
        this.usuarioExiste = false;
        this.user = new Usuario();
        this.user.puntos = this.cartService.puntos + 100;//promocion
        this.form = new FormGroup({
          nombre: new FormControl(null, {updateOn:'blur', validators: [Validators.required]}),
          pago: new FormControl(null, {updateOn:'blur', validators: [Validators.required]}),
        });
      }
    });
  }
  sendOtp()
  {
    var pNumber = '+51' + this.phoneNumber;
    this.bloquear = true;
    this.afauth.auth.signInWithPhoneNumber(pNumber, this.rechaptchaVerifier).then((result) => {
      this.alertCtrl.create({
        header: 'Ingresar código sms',
        inputs: [{name: 'confirmationCode', placeholder: 'Codigo SMS'}],
        buttons: [
          {
            text: 'Cancelar',
            handler: data=> {console.log('Cancelar')}
          },
          {
            text: 'Enviar',
            handler: data=> {
              result.confirm(data.confirmationCode).then(result=> {
                console.log(result.user);
                this.user.uid = result.user.uid;
                this.user.telefono = result.user.phoneNumber;
                this.otpSent = true;
                this.phoneNumber = pNumber;
                //this.confirmationResult = result;
                console.log("Otp sent!")
              }).catch(error=> {
                console.log(error);
                this.alertCtrl.create({
                  header: 'Error en la verificación sms',
                  message: 'Verificar el código SMS',
                  buttons: [
                    {text: 'Aceptar',role:'Cancel',handler: ()=>{this.bloquear=false}}
                  ]
                }).then(alertEl=>{
                  alertEl.present();
                });
              })
            }
          }
        ]
      }).then(alertEl =>{
        alertEl.present();
      });
    }).catch(err => {
      console.log(err);
    });
  }
  terminarVenta()
  {
    if(this.usuarioExiste)
    {
      this.actualizarCarro(this.user);
    }
    else{
      this.user.nombre = this.form.value.nombre;
      this.user.ubicacion = this.ubicacion;
      //guardar usuario si no existe
      this.loadingCtrl.create({message:'Creando Usuario...'}).then(loadingEl => {
        loadingEl.present();
        this.authService.createUser(this.user).then(()=>{
          this.authService.setUserUidLocal(this.user);
          loadingEl.dismiss();
          this.actualizarCarro(this.user);
        });
      });
      
    }
  }
  actualizarCarro(usuario:Usuario)
  {
    //actualizar carro
    this.loadingCtrl.create({message: 'Cargando...'}).then(loadingEl=>{
      loadingEl.present();
      usuario.puntos = usuario.puntos + this.cartService.puntos;
      this.authService.updatePuntos(usuario).then(()=>{
        //TODO generar fecha de entrega
        const fechaEntrega = this.utilService.sumarDias(new Date());
        console.log(fechaEntrega)
        this.cartService.updateCart(this.form.value.pago, usuario.nombre, usuario.uid, fechaEntrega).then(()=>{
          //Guardar la notificacion del carro
          this.cartService.getCartId().then(cartId=>{
            this.notificacionService.createItem(usuario.uid, cartId).then(()=>{
              this.cartService.deleteCartLocal();
              loadingEl.dismiss();
              this.alertCtrl.create({
                header:'Compra exitosa',
                message:'Gracias por su compra!!',
                buttons: [
                  {
                    text: 'Aceptar',handler: ()=>{
                    this.router.navigate(['/tabs/inicio']);}
                  }
                ]
              }).then(alertEl=>{
                alertEl.present();
              });
            });
          });
        });
      });
    });
    //TODO cobrar por tarjeta
  }
}
