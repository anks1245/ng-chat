import { inject, Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword, signOut, User, UserInfo } from '@angular/fire/auth';
import { addDoc, collection, collectionData, Firestore, query, where } from '@angular/fire/firestore';
import { map, Observable, of } from 'rxjs';
import { NgUser } from '../common/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth)
  private store = inject(Firestore)
  user$: Observable<User | null> = authState(this.auth);
  constructor() { }

  register(username: string, email: string, password: string){
      return new Promise(async(resolve, reject)=>{
        let ngUser: NgUser = {
            userId: '',
            name: username,
            email: email,
            profile_pic: null,
            profile_bio: null
        }
        let user = null
        try {
          const ref = await createUserWithEmailAndPassword(this.auth, email, password)
          user = ref.user
          ngUser = {
            ...ngUser,
            userId: ref.user.uid,
            profile_pic: ref.user.photoURL
          }
          await addDoc(collection(this.store, 'users'), ngUser)
          resolve(ngUser)
        } catch (error) {
          await deleteUser(user!)
          reject(error)
        }
        
      })
  }

  login(email:string, password: string){
    return signInWithEmailAndPassword(this.auth, email, password)
  }

  logout(){
    localStorage.clear()
    return signOut(this.auth)
  }

  currentUser(){
    return this.auth.currentUser;
  }

  getAllUsers(uid?: string | null){
    const usersRef = collection(this.store, 'users');
    const q = uid == null || uid == undefined ? query(usersRef) : query(usersRef, where("userId", "!=", uid))
    return collectionData(q) as Observable<NgUser[]>
  }

  getUserById(uid: string): Observable<NgUser | null> {
    const cachedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const userFound = cachedUsers.find((cu: NgUser) => cu.userId === uid);
    if (userFound) {
      return of(userFound);
    }
    const userRef = collection(this.store, 'users');
    const q = query(userRef, where("userId", "==", uid));

    return collectionData(q, { idField: 'id' }).pipe(
      map(users => users.length > 0 ? users[0] as NgUser : null)
    );
  }
}
