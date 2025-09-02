import { Component, inject, Input } from '@angular/core';
import { PRIMENG_MODULES } from '../../primeng-shared';
import { COMMON } from '../../common';
import { TabService } from '../../../services/tab.service';
import { displayName } from '../../utils';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-friend-item-view',
  standalone: true,
  imports: [PRIMENG_MODULES, COMMON],
  templateUrl: './friend-item-view.component.html',
  styleUrl: './friend-item-view.component.scss'
})
export class FriendItemViewComponent {
  @Input('id') id: string | null = null;
  @Input('name') name: string | null = null;
  @Input('email') email: string | null = null;
  @Input('profile_pic') profile_pic: string | null = null;
  tabService = inject(TabService)
  sidebarService = inject(SidebarService)
  dp(name: string){
    return displayName(name)
  }

  startChat(id: string | null){
    this.sidebarService.toggleMobileSidebar()
    this.tabService.setReceiver(id)
  }
}
