
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonNote, IonSpinner, IonTitle, IonToolbar } from '@ionic/angular/standalone';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonButton, IonLabel, IonItem, IonSpinner, ReactiveFormsModule, IonNote]
})
export class RegisterPage {
  
  private formBuilder: FormBuilder= inject(FormBuilder)

  registerForm: FormGroup= this.formBuilder.group({

    names : ['', [Validators.required]],
    lastNames: ['', [Validators.required]],
    email: ['', [Validators.required, , Validators.email]],
    password: ['', [Validators.required]],
    idNumber: ['', [Validators.required]],
    phoneNumber: ['', [Validators.required]]
  })

  get isFormValid():boolean{ 
    return this.registerForm.invalid
  } 


  spinner:boolean=true

  constructor() { }


}
