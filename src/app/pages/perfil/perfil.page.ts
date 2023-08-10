import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { CartComponent } from 'src/app/shared/cart/cart.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  usuario:Usuario;
  usuarioExiste: boolean;
  form: FormGroup;
  mensaje: string;
  loading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() 
  {
    
  }
  ionViewDidEnter()
  {
    this.showUser();
  }
  showUser()
  {
    this.loading = true;
    this.loadingCtrl.create({message: 'Cargando'}).then(loadingEl => {
      loadingEl.present();
      this.authService.getUserUidLocal().subscribe(uid=> {
        if(uid)
        {
          this.authService.getUser(uid).subscribe(doc=> {
            
            this.usuario = new Usuario();
            this.usuario.nombre = doc.data().nombre;
            this.usuario.uid = doc.data().uid;
            this.usuario.telefono = doc.data().telefono;
            this.usuario.ubicacion = doc.data().ubicacion;
            this.usuario.puntos = doc.data().puntos;
  
            this.usuarioExiste = true;
  
            this.form = new FormGroup({
              nombre: new FormControl(this.usuario.nombre, {updateOn:'blur', validators: [Validators.required]}),
              direccion: new FormControl(this.usuario.ubicacion.direccion, {updateOn:'blur', validators: [Validators.required]}),
            });
            loadingEl.dismiss();
            this.loading=false;
          });
        }
        else
        {
          //loguearse
          this.mensaje = "Completa tu compra para actualizar tu perfil."
          this.usuarioExiste = false;
          this.loading = false;
          loadingEl.dismiss();
        }
      });
    });
  }
  async abrirCarrito()
  {
    let modal = await this.modalCtrl.create({
      component: CartComponent
    });
    modal.present();
  }
  actualizarUsuario()
  {
    this.loadingCtrl.create({message: 'Actualizando...'}).then(loadingEl => {
      loadingEl.present();
      this.usuario.nombre = this.form.value.nombre;
      this.usuario.ubicacion.direccion = this.form.value.direccion;
      this.authService.updateUser(this.usuario).then(()=> {
        loadingEl.dismiss();
        this.router.navigate(['/tabs/inicio']);
      });
    });
    
  }

}
