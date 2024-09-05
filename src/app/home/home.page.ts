import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, ToastController } from '@ionic/angular/standalone';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonButton, IonHeader, IonToolbar, IonTitle, IonContent],
})

export class HomePage {
  private _authService:AuthService= inject(AuthService)
  private _router : Router = inject(Router)
  private _toasController: ToastController = inject(ToastController)
  constructor() {}

  async logOut():Promise<void>{
    await this._authService.signOut().then(async ()=>{
      this._router.navigate(['/login'])
      await this.showAlert('Ha cerrado sesión correctamente!', false)
      console.log('Logged Out')
    }).catch( async ()=>{
      await this.showAlert('Ups ocurrido un problema!', true)
    })
  }

  async showAlert(message:string, isError:boolean = false): Promise<void>{
    const toast= await this._toasController.create({
      message: message,
      duration: 4000,
      color: isError? 'danger': 'success'
    })
    toast.present()
  }
}
