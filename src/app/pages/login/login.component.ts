import { Component, inject, OnInit } from '@angular/core';
import { PRIMENG_MODULES } from '../../common/primeng-shared';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { COMMON } from '../../common/common';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { NgUser } from '../../common/models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [COMMON, PRIMENG_MODULES],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
})
export class LoginComponent implements OnInit{
  isLoading = false
  loginForm: FormGroup | undefined
  authService = inject(AuthService)
  messageService = inject(MessageService)
  router = inject(Router)
  constructor(){
    const uid = localStorage.getItem("uid")
    this.authService.user$
      .pipe(take(1))
      .subscribe(user => {
        if (user && uid) {
          this.router.navigate(['/chats']);
        }
    });
  }
  ngOnInit(){
    this.loginForm = new FormGroup({
      email: new FormControl(null,[Validators.required, Validators.email]),
      password: new FormControl(null,[Validators.required, Validators.minLength(8)])
    })
  }

  async loginUser(){
    if(this.loginForm?.invalid){
      this.loginForm?.markAllAsTouched()
      return
    }
    this.isLoading = true
    
    try {
      const res = await this.authService.login(this.loginForm?.get("email")?.value, this.loginForm?.get("password")?.value)
      localStorage.setItem("uid",res.user.uid)
      this.router.navigate(["chats"])
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Failed', detail: "Invalid email or password" });
    } finally {
      this.isLoading = false
    }
  }
}
