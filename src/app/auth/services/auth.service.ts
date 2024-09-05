import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential, user, User } from '@angular/fire/auth';
import { CollectionReference, DocumentReference, Firestore, collection, doc, setDoc } from '@angular/fire/firestore';

import { LoginDto } from '../models/login.dto';
import { RegisterDto } from '../models/register.dto';


const PATH: string='users';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _auth: Auth =inject(Auth)
  private _firestore: Firestore= inject(Firestore)
  private _collection: CollectionReference = collection (
    this._firestore, PATH
  )


  async isUserLoggued(): Promise<boolean>{
    return new Promise<boolean>((resolve, reject)=>{
      this._auth.onAuthStateChanged((user: User | null)=>{
        if (user)
          resolve(true)
        else
          resolve(false)
      })
    })
  }

  async createUserInFirestore(user:RegisterDto):Promise<void>{
    const docRef: DocumentReference= doc(this._collection, user.uid)
    await setDoc(docRef, {
      names: user.names,
      lastNames: user.lastNames,
      email: user.email,
      dni:user.dni,
      phone: user.phoneNumber,
      uid: user.uid
    }
      )
  }

  async login(model: LoginDto): Promise<UserCredential>{

    const isUserLoggued:boolean =await this.isUserLoggued()
    if(isUserLoggued) 
      Promise.reject('Usuario esta logueado')

    return await signInWithEmailAndPassword(
      this._auth,
      model.email,
      model.password
    )
  }

  async signUp( model: LoginDto): Promise<UserCredential>{
    const isUserLoggued:boolean =await this.isUserLoggued()
    if(isUserLoggued) 
      Promise.reject('Usuario esta logueado')

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
