
import { Component, inject  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonNote, IonSpinner, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { RegisterDto } from '../../models/register.dto';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonButton, IonLabel, IonItem, IonSpinner, ReactiveFormsModule, IonNote]
})
export class RegisterPage {

  asteriscoReq:string='*'
  textBtnRegister:string='Registrarse'
  spinner:boolean=false
  
  private formBuilder: FormBuilder= inject(FormBuilder)
  registerDto: RegisterDto= {} as RegisterDto

  registerForm: FormGroup= this.formBuilder.group({

    names : ['', [Validators.required]],
    lastNames: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    dni: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
    phoneNumber: ['', [Validators.required, Validators.minLength(8)]]
  })

  get isFormValid():boolean{ 
    return this.registerForm.invalid
  } 

  get isNamesRequired():boolean{
    const control: AbstractControl | null = this.registerForm.get('names')
    return control ? control.hasError('required') && control.touched : false
  }
  
  get isLastNamesRequired():boolean{
    const control: AbstractControl | null = this.registerForm.get('lastNames')
    return control ? control.hasError('required') && control.touched : false
  }

  get isEmailRequired():boolean{
    const control: AbstractControl | null = this.registerForm.get('email')
    return control ? control.hasError('required') && control.touched : false
  }

  get isEmailValid():boolean{
    const control: AbstractControl | null = this.registerForm.get('email')
    return control ? control.hasError('email') && control.touched : false
  }

  get isPasswordRequired():boolean{
    const control: AbstractControl | null = this.registerForm.get('password')
    return control ? control.hasError('required') && control.touched : false
  }

  get isDniRequired():boolean{
    const control: AbstractControl | null = this.registerForm.get('dni')
    return control ? control.hasError('required') && control.touched : false
  }

  get isDniMinLength():boolean{
    const control: AbstractControl | null = this.registerForm.get('dni')
    return control ? control.hasError('minLength') && control.touched : false
  }

  get isDniMaxLength():boolean{
    const control: AbstractControl | null = this.registerForm.get('dni')
    return control ? control.hasError('maxLength') && control.touched : false
  }

  get isPhoneNumberRequired():boolean{
    const control: AbstractControl | null = this.registerForm.get('phoneNumber')
    return control ? control.hasError('required') && control.touched : false
  }

  get isPhoneNumberMinLength():boolean{
    const control: AbstractControl | null = this.registerForm.get('phoneNumber')
    return control ? control.hasError('minLength') && control.touched : false
  }

 

  save():void{
    this.textBtnRegister='Registrando Usuario'
    this.registerDto= this.registerForm.value as RegisterDto
    
    console.log('Datos:', this.registerDto)
    
    this.spinner=true

    setTimeout(() => {
      this.registerForm.reset()
      this.spinner=false
    }, 10000);
  }


}
