
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonNote, IonSpinner, IonTitle, IonToolbar,IonInputPasswordToggle} from '@ionic/angular/standalone';

import { LoginDto } from '../../models/login.dto';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, FormsModule, IonHeader, IonTitle, IonToolbar, CommonModule, IonInput, IonButton, IonLabel, IonItem, IonSpinner, ReactiveFormsModule, IonNote, IonInputPasswordToggle]
})

export class LoginPage {
  asteriscoReq:string='*'
  textBtnRegister:string='Ingresar'
  spinner:boolean=false

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

  save(){
    this.textBtnRegister='Ingresando'
    this.loginDto= this.loginForm.value as LoginDto
    this.loginForm.reset()
  
    console.log('Datos:', this.loginDto)
    
    this.spinner=true
    
    setTimeout(() => {    
      this.spinner=false
      this.textBtnRegister='Ingresar'
    }, 5000);
  }
}
