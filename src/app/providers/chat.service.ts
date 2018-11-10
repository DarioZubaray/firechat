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
    this.mensajesCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'asc').limit(5));
    return this.mensajesCollection.valueChanges()
               .pipe(map( (mensajes: Mensaje[]) => {
                 this.chats = [];
                 for( let mensaje of mensajes) {
                   this.chats.unshift( mensaje );
                 }
                 
               }));
  }

  agregarMensaje( texto: string ) {

      //TODO falta el UID del usuario
      let mensaje : Mensaje = {
        nombre: 'DarioDemo',
        mensaje: texto,
        fecha: new Date().getTime()
      };

      return this.mensajesCollection.add( mensaje );

  }
}
