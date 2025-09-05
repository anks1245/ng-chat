import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, collectionData, Firestore, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CallsService {
  private auth = inject(Auth)
  private store = inject(Firestore)
  constructor() { }

  createRoom(room: any){
    const roomRef = collection(this.store, "rooms")
    return addDoc(roomRef, room)
  }

  getRoom(uid: string|undefined){
    const roomRef = collection(this.store, "rooms")
    // const q = uid == null || uid == undefined ? query(roomRef) : query(roomRef, where("userId", "!=", uid))
    const rooms = collectionData(roomRef) as Observable<any>
    return rooms
  }

}
