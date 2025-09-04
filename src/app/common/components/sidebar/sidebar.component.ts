import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from "primeng/button";
import { PRIMENG_MODULES } from '../../primeng-shared';
import { MenuItem, MessageService } from 'primeng/api';
import { COMMON } from '../../common';
import { MyChatsComponent } from '../../../pages/chats/tabs/my-chats/my-chats.component';
import { FriendsComponent } from '../../../pages/chats/tabs/friends/friends.component';
import { GroupsComponent } from '../../../pages/chats/tabs/groups/groups.component';
import { CallsComponent } from '../../../pages/chats/tabs/calls/calls.component';
import { ConfirmationService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { TabService } from '../../../services/tab.service';
import { User } from '@angular/fire/auth';
import { displayName } from '../../utils';
import { NgUser } from '../../models/user';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    PRIMENG_MODULES,
    COMMON,
    MyChatsComponent,
    FriendsComponent,
    GroupsComponent,
    CallsComponent
],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class SidebarComponent implements OnInit{
  items: MenuItem[] | undefined;
  activeMenu: MenuItem | undefined
  confirmationService = inject(ConfirmationService)
  authServices = inject(AuthService)
  router = inject(Router)
  tabService = inject(TabService)
  messageService = inject(MessageService)
  // sidebarService = inject(SidebarService)
  isMobileSidebarOpen = false
  user: NgUser | null = null
  ngOnInit(): void {
    this.items = [
      { label:'Chats',icon: 'pi pi-comments' },
      { label:'Friends',icon: 'pi pi-users' },
      { label:'Groups',icon: 'pi pi-list' },
      { label:'Calls',icon: 'pi pi-circle-on' }
    ]
    this.activeMenu = this.items[0]

    // this.sidebarService.mobileSidebar$.subscribe(m=>{
    //   console.log(m);
    // })

    this.tabService.tab$.subscribe(t=>{
      const m = this.items?.find(i=>i.label == t)
      this.activeMenu = m
    })

    this.getCurrentUser()
  }

  dp(name: string){
    return displayName(name)
  }

  getCurrentUser(){
    const uid = localStorage.getItem("uid")
    try {
      this.authServices.getUserById(uid!).subscribe(u=>{
        this.user = u
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Failed', detail: "Something went wrong" });
    } 
  }

  onTabChange(){
    this.tabService.setTab(this.activeMenu?.label as "Chats" | "Friends" | "Groups" | "Calls" | undefined)
  }

  confirmLogout(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure you want to logout from NgChats?',
            header: 'Logout Confirmation',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass:"p-button-danger p-button-text",
            rejectButtonStyleClass:"p-button-text p-button-text",
            acceptIcon:"none",
            rejectIcon:"none",

            accept: async() => {
              await this.authServices.logout()
              this.router.navigate(["/login"])
            },
            reject: () => {
                // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            }
        });
    }
}
