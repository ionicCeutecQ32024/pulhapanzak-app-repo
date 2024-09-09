import { Component, inject  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonNote, IonSpinner, IonTitle, IonToolbar, IonToast, IonInputPasswordToggle, ToastController } from '@ionic/angular/standalone';
import { RegisterDto } from '../../models/register.dto';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonButton, IonLabel, IonItem, IonSpinner, ReactiveFormsModule, IonNote, IonToast, IonInputPasswordToggle]
})
export class RegisterPage {
  private _authService:AuthService= inject(AuthService)
  private _toasController: ToastController = inject(ToastController)
  private _router:Router= inject(Router)
  
  asteriscoReq:string='*'
  textBtnRegister:string='Registrarse'
  spinner:boolean=false
  disabled:boolean=false

  private formBuilder: FormBuilder= inject(FormBuilder)
  registerDto: RegisterDto= {} as RegisterDto

  
  constructor(private toastController: ToastController) {}

  
  registerForm: FormGroup= this.formBuilder.group({

    names : ['', [Validators.required]],
    lastNames: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    dni: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13), Validators.pattern('^[0-9]+$')]],
    phoneNumber: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^[0-9]+$')]]
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

  get isDniMinLength(): boolean {
    const control: AbstractControl | null = this.registerForm.get('dni');
    return control ? control.hasError('minlength') && control.touched : false;
  }

  get isDniPattern(): boolean {
    const control: AbstractControl | null = this.registerForm.get('dni');
    return control ? control.hasError('pattern') && control.touched : false;
  }

  get isDniMaxLength(): boolean {
    const control: AbstractControl | null = this.registerForm.get('dni');
    return control ? control.hasError('maxlength') && control.touched : false;
  }

  get isPhoneNumberRequired(): boolean {
    const control: AbstractControl | null = this.registerForm.get('phoneNumber');
    return control ? control.hasError('required') && control.touched : false;
  }
  
  get isPhoneNumberMinLength(): boolean {
    const control: AbstractControl | null = this.registerForm.get('phoneNumber');
    return control ? control.hasError('minlength') && control.touched : false;
  }

  get isPhoneNumberPattern(): boolean {
    const control: AbstractControl | null = this.registerForm.get('phoneNumber');
    return control ? control.hasError('pattern') && control.touched : false;
  }
 

  async onSubmit(): Promise<void> {
    debugger
    this.textBtnRegister='Registrando Usuario'
    this.registerDto= this.registerForm.value as RegisterDto
    console.log('Datos:', this.registerDto)
    
    this._authService.signUp(this.registerDto).then( async (result)=>{
      this.registerDto.uid= result.user.uid
      
      await this._authService.createUserInFirestore(this.registerDto).then(async () => {
        this.spinner=true
        this.disabled=true
        this._router.navigate(['/tabs/home'])
        this.registerForm.reset()
        await this.showAlert('Usuario creado correctamente', false)
      })
    }).catch( async ()=>{
      this.spinner=true
      await this.showAlert('Ha ocurrido un error, vuelve a intentarlo!', true)
    })

    setTimeout(() => {    
      this.spinner=false
      this.disabled=false
      this.textBtnRegister='Registrarse'
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
