import { inject, Injectable } from '@angular/core';
import {
  deleteObject,
  getDownloadURL,
  ref,
  Storage,
  uploadBytes,
} from '@angular/fire/storage';

const folder: string = 'users';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private storage: Storage = inject(Storage);

  async uploadImage(image: string, userId: string): Promise<string> {
    try {
      const url = `${folder}/${userId}.jpg`;
      const storageReference = ref(this.storage, url);

      const imageExist = await getDownloadURL(storageReference).catch(
        () => null
      );
      if (imageExist) {
        await deleteObject(ref(this.storage, imageExist));
      }

      const file = await fetch(image);
      const imageBlob = await file.blob();
      const result = await uploadBytes(storageReference, imageBlob);
      const imageUrl = await getDownloadURL(result.ref);
      return imageUrl;
    } catch (error) {
      throw new Error('Error al subir la imagen');
    }
  }
}
