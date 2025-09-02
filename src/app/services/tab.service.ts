import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabService {
  private tabSubject = new Subject<string | null>();
  private receiverSubject = new Subject<string | null>();
  private groupSubject = new Subject<string | null>();
  private callsSubject = new Subject<string | null>();

  tab$ = this.tabSubject.asObservable()
  receiver$ = this.receiverSubject.asObservable()
  group$ = this.groupSubject.asObservable()
  calls$ = this.callsSubject.asObservable()

  constructor() { }

  setTab(tab: 'Chats' | 'Friends' | 'Groups' | 'Calls' = 'Chats'){
    // this.clearAll()
    this.tabSubject.next(tab)
  }

  setReceiver(receiver: string | null = null){
    this.receiverSubject.next(receiver)
  }

  setGroup(group: string | null = null){
    this.groupSubject.next(group)
  }

  setCalls(call: string | null = null){
    this.callsSubject.next(call)
  }

  clearAll(){
    this.receiverSubject.next(null)
    this.groupSubject.next(null)
    this.callsSubject.next(null)
  }
  
}
