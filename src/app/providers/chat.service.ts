import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Mensaje } from '../interface/mensaje.interface';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public chats: Mensaje[] = [];
  private mensajesCollection: AngularFirestoreCollection<Mensaje>;

  constructor(private afs: AngularFirestore) { }

  cargarMensajes() {
    this.mensajesCollection = this.afs.collection<Mensaje>('chats');
    return this.mensajesCollection.valueChanges()
               .pipe(map( (mensajes: Mensaje[]) => {
                 console.log(mensajes);
                 this.chats = mensajes;
               }));
  }
}
