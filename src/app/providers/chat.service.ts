import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Mensaje } from '../interface/mensaje.interface';

import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public chats: Mensaje[] = [];
  private mensajesCollection: AngularFirestoreCollection<Mensaje>;
  public usuario: any = {};

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth) {
      this.afAuth.authState.subscribe( user => {
        console.log('Estado del usuario: ', user);
        if( !user ) {
          return;
        }

        this.usuario.nombre = user.displayName;
        this.usuario.uid = user.uid;
      });
  }

  login( proveedor: string) {
    if( proveedor === 'google') {
      this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    }
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  cargarMensajes() {
    this.mensajesCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc').limit(5));
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
