import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { PRIMENG_MODULES } from '../../primeng-shared';
import { COMMON } from '../../common';
import { TabService } from '../../../services/tab.service';
import { ChatComponent } from "../chat/chat.component";
import { NgUser } from '../../models/user';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { displayName } from '../../utils';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChatsService } from '../../../services/chats.service';
import { ChatMessage } from '../../models/chat';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-chatbox',
  standalone: true,
  imports: [PRIMENG_MODULES, COMMON],
  templateUrl: './chatbox.component.html',
  styleUrl: './chatbox.component.scss',
  providers: [MessageService]
})
export class ChatboxComponent implements OnInit{
  tab: string = 'Chats';
  receiver: string | null = null;
  group: string | null = null; 
  calls: string | null = null;
  tabService = inject(TabService);
  ngUser: NgUser | null = null
  currentUser: NgUser | null = null
  authService = inject(AuthService)
  messageService = inject(MessageService)
  chatService = inject(ChatsService)
  sidebarService = inject(SidebarService)
  messageForm: FormGroup | undefined 
  isLoading = false
  uid: string | null = null
  chatMessages: ChatMessage[] = []
  @ViewChild('chatBody') private chatBody!: ElementRef;
  ngOnInit(): void {
    this.uid = localStorage.getItem("uid") ?? null
    this.loadUser(this.uid!, true) 
    this.tabService.tab$.subscribe(tab=>{
      this.tab = tab ?? 'Chats'
    })
    this.tabService.receiver$.subscribe(receiver=>{
      this.receiver = receiver ?? null
      if(receiver != null){
        this.loadUser(receiver)
        this.getMessageObserver()
      }
    })
    this.messageForm = new FormGroup({
      message: new FormControl(null, [Validators.required])
    })
  }

  dp(name: string = "Un Known"){
      return displayName(name)
  }

  loadUser(uid: string, self = false){
    this.isLoading = true
    try {
      this.authService.getUserById(uid).subscribe(u=>{
        if(self){
          this.currentUser = u
        }else{
          this.ngUser = u
        }
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Failed', detail: "Unable to fetch the user" });
    } finally {
      this.isLoading = false
    }
  }

  sendMessage(){
    if(this.messageForm?.invalid){
      this.messageForm?.markAllAsTouched()
      return
    }
    this.isLoading = true
    try {
      console.log(this.uid!, this.receiver!, this.messageForm?.get("message")?.value);
      this.chatService.sendMessage(this.uid!, this.receiver!, this.messageForm?.get("message")?.value)
      this.messageForm?.reset()
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Failed', detail: "Unable to send the message" });
    } finally {
      this.isLoading = false
    }
    
  }

  //Observing messages
  getMessageObserver(){
    this.chatService.getMessages(this.uid!, this.receiver!).subscribe(msgs=>{
      this.chatMessages = msgs
      console.log(msgs);
    })
  }

  onClickToggleMobileSidebar(){
    this.sidebarService.toggleMobileSidebar()
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom(); // ensures scroll after each update
  }

  private scrollToBottom(): void {
    try {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
