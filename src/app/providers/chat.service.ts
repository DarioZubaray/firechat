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
    } else if( proveedor === 'twitter') {
      this.afAuth.auth.signInWithPopup(new auth.TwitterAuthProvider());
    }
  }

  logout() {
    this.usuario = {};
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

      let mensaje : Mensaje = {
        nombre: this.usuario.nombre,
        mensaje: texto,
        fecha: new Date().getTime(),
        uid: this.usuario.uid
      };

      return this.mensajesCollection.add( mensaje );
  }


}
