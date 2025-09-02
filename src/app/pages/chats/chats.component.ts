import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SidebarComponent } from "../../common/components/sidebar/sidebar.component";
import { ChatboxComponent } from "../../common/components/chatbox/chatbox.component";
import { AuthService } from '../../services/auth.service';
import { SidebarService } from '../../services/sidebar.service';
import { Subscription } from 'rxjs';
import { NgClass } from "../../../../node_modules/@angular/common/index";
import { COMMON } from '../../common/common';
import { PRIMENG_MODULES } from '../../common/primeng-shared';

@Component({
  selector: 'app-chats',
  standalone: true,
  imports: [
    COMMON,
    PRIMENG_MODULES,
    SidebarComponent,
    ChatboxComponent
],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss'
})
export class ChatsComponent implements OnInit, OnDestroy{
  authService = inject(AuthService)
  sidebarService = inject(SidebarService)
  isMobileSidebarOpen = false
  private subs!: Subscription
  ngOnInit(): void {
    this.getAllUsers()
    this.subs = this.sidebarService.mobileSidebar$.subscribe(m=>{
      console.log(m)
      this.isMobileSidebarOpen = m
    })
  }
  getAllUsers(){
    this.authService.getAllUsers().subscribe(u=>{
      localStorage.setItem("users", JSON.stringify(u))
    })
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }
}
