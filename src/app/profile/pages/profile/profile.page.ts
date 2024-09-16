import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserDto } from 'src/app/auth/models/user.dto';
import { Camera, CameraResultType } from '@capacitor/camera';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonImg,
  IonItem,
  IonLabel,
  IonNote,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule,
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonImg,
    IonItem,
    IonLabel,
    IonNote,
    IonSpinner,
    IonTitle,
    IonToolbar,
    ReactiveFormsModule,]
})
export class ProfilePage implements OnInit {
  private _authService: AuthService = inject(AuthService);
  private _profielService: ProfileService = inject(ProfileService);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private _toasController: ToastController = inject(ToastController)
  disabled: boolean = false;
  userForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.minLength(8)]],
    email: ['', [Validators.required, Validators.email]],
    photo: ['', [Validators.required]],
    uid: ['', [Validators.required]],
    dni: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13), Validators.pattern('^[0-9]+$')]],
  });
  spinner: boolean = false;
  user: UserDto = {} as UserDto;

  get isNameRequired(): boolean {
    const control: AbstractControl | null = this.userForm.get('name');
    return control ? control.hasError('required') && control.touched : false;
  }

  get isPhoneRequired(): boolean {
    const control: AbstractControl | null = this.userForm.get('phone');
    return control ? control.hasError('required') && control.touched : false;
  }

  get isPhoneMinLegthError(): boolean {
    const control: AbstractControl | null = this.userForm.get('phone');
    return control ? control.hasError('minlength') && control.touched : false;
  }

  get isFormInvalid(): boolean {
    return this.userForm.invalid;
  }

  clearSpinner(): void {
    this.disabled = true;
    this.spinner = true;
  }

  setSpinner(): void {
    this.disabled = true;
    this.spinner = true;
  }

  ngOnInit() {
    this._authService
      .getUserById()
      .then((user) => {
        this.user = user!;
        this.userForm.patchValue({
          name: this.user.name,
          phone: this.user.phone,
          photo: this.user.photo,
          email: this.user.email,
          uid: this.user.uid,
        });
      })
      .catch(async () => {
        await this.showAlert('Ha ocurrido un error', true);
      });
  }

  async onPickImage(): Promise<void> {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      saveToGallery: true,
      promptLabelHeader: 'Selecciona una foto',
      promptLabelPhoto: 'Galería',
      promptLabelPicture: 'Cámara',
      promptLabelCancel: 'Cancelar',
    });

    if (!image) return;

    this.user.photo = image.webPath ?? image.path ?? '';
    this.userForm.patchValue({ photo: this.user.photo });
  }

  onSubmit(): void {
    if (!this.isFormInvalid) {
      this.setSpinner();
      let user: UserDto = this.userForm.value as UserDto;
      user.email = this.user.email;

      this._profielService
        .uploadImage(user.photo, user.uid)
        .then(async (url: string) => {
          user.photo = url;
          this._authService
            .updateUser(user)
            .then(async () => {
              this.clearSpinner();
              await this.showAlert('Perfil actualizado correctamente');
            })
            .catch(async () => {
              this.clearSpinner();
              await this.showAlert('Ha ocurrido un error', true);
            });
        })
        .catch(async () => {
          this.clearSpinner();
          await this.showAlert('Ha ocurrido un error', true);
        });
    }
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
