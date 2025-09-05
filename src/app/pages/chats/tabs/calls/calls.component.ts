import { Component, inject, OnInit } from '@angular/core';
import { COMMON } from '../../../../common/common';
import { PRIMENG_MODULES } from '../../../../common/primeng-shared';
import { NgUser } from '../../../../common/models/user';
import { AuthService } from '../../../../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CallsService } from '../../../../services/calls.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-calls',
  standalone: true,
  imports: [COMMON, PRIMENG_MODULES],
  templateUrl: './calls.component.html',
  styleUrl: './calls.component.scss',
  providers: [MessageService]
})
export class CallsComponent implements OnInit {
  visible = false
  users! : NgUser[]
  authService = inject(AuthService)
  callService = inject(CallsService)
  messageService = inject(MessageService)
  formGroup!: FormGroup;
  loading = false;
  calls: any[] = []
  ngOnInit(): void {
    const uid = localStorage.getItem("uid")
    this.authService.getAllUsers(uid).subscribe(u=>{
      this.users = u
    })

    this.callService.getRoom(uid!).subscribe(r=>{
      console.log(r);
      
      this.calls = r
    })

    this.formGroup = new FormGroup({
      'room_name': new FormControl(null, [Validators.required]),
      'participants': new FormControl(null, [Validators.required]),
      'description': new FormControl(null)
    })
  }

  async createRoom(){
    if(this.formGroup.invalid){
      this.formGroup.markAllAsTouched()
      return
    }
    this.loading = true
    try {
      await this.callService.createRoom(this.formGroup.value)
      this.messageService.add({ severity: 'success', summary: 'Success', detail: "Room created" })
      this.visible = false
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Failed', detail: "Unable to create the room" });
    } finally {
      this.loading = false
    }
    
  }

  showDialog(){
    this.visible = true
  }
}
