import { Component, inject, OnInit } from '@angular/core';
import { NgUser } from '../../../../common/models/user';
import { AuthService } from '../../../../services/auth.service';
import { PRIMENG_MODULES } from '../../../../common/primeng-shared';
import { COMMON } from '../../../../common/common';
import { FriendItemViewComponent } from '../../../../common/components/friend-item-view/friend-item-view.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [
    PRIMENG_MODULES, 
    COMMON,
    FriendItemViewComponent
  ],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss',
  providers: [MessageService]
})
export class FriendsComponent implements OnInit {
  users: NgUser[] = [];
  authService = inject(AuthService)
  messageService = inject(MessageService)
  uid: string | null = null
  isLoading = false
  userSekeletons = Array(5).fill(0).map((x,i)=>i);

  ngOnInit() {
    this.uid = localStorage.getItem("uid")
    this.getUsers()
  }

  getUsers(){
    this.isLoading = true
    try {
      this.authService.getAllUsers(this.uid).subscribe(data => {
        this.users = data;
      });
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Failed', detail: "Something went wrong" });
    } finally {
      this.isLoading = false
    }
  }
}
