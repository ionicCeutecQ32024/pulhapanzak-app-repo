import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential, user, User } from '@angular/fire/auth';
import { CollectionReference, DocumentReference, Firestore, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';

import { LoginDto } from '../models/login.dto';
import { RegisterDto } from '../models/register.dto';
import { UserDto } from '../models/user.dto';


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

  private async getCurrentUser(): Promise<User | null> {
    return new Promise<User | null>((resolve) => {
      this._auth.onAuthStateChanged((user: User | null) => {
        console.log('user ->', user);
        if (user) {
          resolve(user);
        } else {
          resolve(null);
        }
      });
    });
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

  async createUser(user: UserDto): Promise<void> {
    const docRef: DocumentReference = doc(this._collection);
    await setDoc(docRef, {
      name: user.name,
      phone: user.phone,
      photo: '',
      email: user.email,
      uid: docRef.id,
      isActive: true,
    });
  }


  async getUserById(): Promise<UserDto | null> {
    try {
      const user = await this.getCurrentUser();
      const docRef = doc(this._firestore, PATH, user?.uid ?? '');
      const userSnapshot = await getDoc(docRef);
      if (userSnapshot.exists()) {
        return userSnapshot.data() as UserDto;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async getUserByQuery(): Promise<UserDto | null> {
    const user = await this.getCurrentUser();
    const userQuery = query(
      this._collection,
      where('uid', '==', user?.uid),
      where('isActive', '==', true),
      where('age', '>=', 23),
      orderBy('name', 'asc') // Para ordenar de forma ascendente
      //orderBy('name', 'desc') // Para ordenar de forma descendente
    );
    const userSnapshot = await getDocs(userQuery);
    if (userSnapshot.empty) {
      return null;
    }
    return userSnapshot.docs[0].data() as UserDto;
  }

  // Método para actualizar un usuario en Firestore.
  async updateUser(user: UserDto): Promise<void> {
    if (!user.uid) throw new Error('User UID is required');

    const docRef = doc(this._collection, user.uid);
    await updateDoc(docRef, {
      ...{
        name: user.name,
        phone: user.phone,
        email: user.email,
        photo: user.photo,
      },
    });
  }

  async deleteUser(id: string): Promise<void> {
    if (!id) throw new Error('User UID is required');

    const docRef = doc(this._collection, id);
    await deleteDoc(docRef);
  }
}
