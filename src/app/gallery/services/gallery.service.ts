import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  constructor(private firestore: Firestore) {}
  getGalleryItems(): Observable<any[]> {
    const galleryCollection = collection(this.firestore, 'galleries'); 
    return collectionData(galleryCollection, { idField: 'id' });
  }
}
