import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChatsService } from '../../../../services/chats.service';
import { AuthService } from '../../../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { PRIMENG_MODULES } from '../../../../common/primeng-shared';
import { COMMON } from '../../../../common/common';
import { displayName } from '../../../../common/utils';
import { TabService } from '../../../../services/tab.service';
import { SidebarService } from '../../../../services/sidebar.service';

@Component({
  selector: 'app-my-chats',
  standalone: true,
  imports: [PRIMENG_MODULES, COMMON],
  templateUrl: './my-chats.component.html',
  styleUrl: './my-chats.component.scss'
})
export class MyChatsComponent implements OnInit {
  recentChats: any[] = [];
  chatService = inject(ChatsService);
  authService = inject(AuthService);
  tabService = inject(TabService)
  sidebarService = inject(SidebarService)
  uid = localStorage.getItem("uid");

  ngOnInit(): void {
    this.getChatsRecent();
  }

  async getChatsRecent() {
    try {
      this.chatService.getRecentChats().subscribe(async lastChats => {
        let recentChats: any[] = lastChats.filter(
          lc => lc.from === this.uid || lc.to === this.uid
        );
        // this.recentChats = recentChats

        // enrich each chat with user data
        const enrichedData = await Promise.all(
          recentChats.map(async rc => {
            const otherParty = rc.from === this.uid ? rc.to : rc.from;
            const me = rc.from !== this.uid ? rc.to : rc.from;

            rc.other_party = await this.loadUser(otherParty);
            rc.me = await this.loadUser(me);

            return rc;
          })
        );
        this.recentChats = enrichedData.reverse()
        // console.log(this.recentChats);
      });
    } catch (error) {
      console.error(error);
    }
  }

  dp(name: string){
    return displayName(name)
  }

  loadUser(userId: string) {
    // convert observable to a promise
    return firstValueFrom(this.authService.getUserById(userId));
  }

  startChat(id: string | null){
    // console.log(id);
    this.sidebarService.toggleMobileSidebar()
    this.tabService.setReceiver(id)
  }

  navigateToFriendTab(){
    this.tabService.setTab("Friends")
  }
}
