import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { LoginDto } from '../models/login.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _auth: Auth =inject(Auth)

  constructor() { }

  async login(model: LoginDto): Promise<UserCredential>{
    return await signInWithEmailAndPassword(
      this._auth,
      model.email,
      model.password
    )
  }

  async signUp( model: LoginDto): Promise<UserCredential>{
    return await createUserWithEmailAndPassword(
      this._auth,
      model.email,
      model.password
    )
  }

  async signOut(): Promise<void>{
    return await this._auth.signOut()
  }
}
