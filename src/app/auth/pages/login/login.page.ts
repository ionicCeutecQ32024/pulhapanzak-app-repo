import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonNote, IonSpinner, IonTitle, IonToolbar,IonInputPasswordToggle, ToastController} from '@ionic/angular/standalone';

import { LoginDto } from '../../models/login.dto';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, FormsModule, IonHeader, IonTitle, IonToolbar, CommonModule, IonInput, IonButton, IonLabel, IonItem, IonSpinner, ReactiveFormsModule, IonNote, IonInputPasswordToggle]
})

export class LoginPage {
  private _authService:AuthService= inject(AuthService)
  private _router:Router= inject(Router)
  private _toasController: ToastController = inject(ToastController)

  asteriscoReq:string='*'
  textBtnRegister:string='Iniciar Sesión'
  spinner:boolean=false
  disabled:boolean=false

  


  private formBuilder: FormBuilder= inject(FormBuilder)
  loginDto: LoginDto= {} as LoginDto

  loginForm: FormGroup= this.formBuilder.group({

    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  })

  get isFormValid():boolean{ 
    return this.loginForm.invalid
  } 

  get isEmailRequired():boolean{
    const control: AbstractControl | null = this.loginForm.get('email')
    return control ? control.hasError('required') && control.touched : false
  }

  get isEmailValid():boolean{
    const control: AbstractControl | null = this.loginForm.get('email')
    return control ? control.hasError('email') && control.touched : false
  }

  get isPasswordRequired():boolean{
    const control: AbstractControl | null = this.loginForm.get('password')
    return control ? control.hasError('required') && control.touched : false
  }





  onSuubmit(){
    if (!this.isFormValid){
      this.disabled=true
      this.textBtnRegister='Ingresando'
      this.loginDto = this.loginForm.value as LoginDto
      console.log('Datos:', this.loginDto)
      this.spinner=true

      this._authService.login(this.loginDto).then( async ()=>{
        
        this.spinner=false
        this.loginForm.reset()
        this._router.navigate(['/home'])
        await this.showAlert('Ingreso Satisfactorio', false)
      }).catch( async ()=>{
        this.spinner=true
        await this.showAlert('Usuario o contraseña son incorrectas', true)
      })
    }
    setTimeout(() => { 
      this.disabled=false
      this.spinner=false
      this.textBtnRegister='Ingresar'
    }, 5000);
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
