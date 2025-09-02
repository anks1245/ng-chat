import { inject, Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Database, get, listVal, orderByChild, push, query, ref, set, update } from '@angular/fire/database';
import { Observable, timestamp } from 'rxjs';
import { ChatMessage } from '../common/models/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  uid = localStorage.getItem("uid")
  auth = inject(Auth)
  rtd = inject(Database)
  constructor() { }

  async sendMessage(sender: string, receiver: string, message: string){
    const chat: ChatMessage = {
      from: sender,
      to: receiver,
      message: message,
      on: this.getFormattedDateTime(),
      timestamp: Date.now()
    }
    
    const chatMsgRef = ref(this.rtd, "chats/"+`${this.getSortedSenderReceiver(sender, receiver)}`)
    const newMessageRef = push(chatMsgRef);

    const lastChatRef = ref(this.rtd, "lastChats/"+`${this.getSortedSenderReceiver(sender, receiver)}`)
    update(lastChatRef, chat)
    
    return set(newMessageRef, chat)
  }

  getMessages(sender: string, receiver: string): Observable<ChatMessage[]> {
    const chatRef = ref(this.rtd, "chats/" + `${this.getSortedSenderReceiver(sender, receiver)}`);
    const chatQuery = query(chatRef, orderByChild('timestamp'));
    return listVal<ChatMessage>(chatQuery);
  }

  getRecentChats(): Observable<ChatMessage[]> {
    const lastChatRef = ref(this.rtd, "lastChats")
    const lastChatQuery = query(lastChatRef, orderByChild("timestamp"))
    const lastChats = listVal<ChatMessage>(lastChatQuery)
    console.log(lastChats)
    return lastChats
  }

  getSortedSenderReceiver(sender: string, receiver: string){
    return [sender, receiver].sort().join("_")
  }

  getFormattedDateTime() {
    const now = new Date();

    // Extract parts
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // months start from 0
    const year = String(now.getFullYear()).slice(-2); // last 2 digits
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
}
