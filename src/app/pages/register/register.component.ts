import { Component, inject, OnInit } from '@angular/core';
import { PRIMENG_MODULES } from '../../common/primeng-shared';
import { COMMON } from '../../common/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [COMMON, PRIMENG_MODULES],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [MessageService]
})
export class RegisterComponent implements OnInit {
    isLoading = false
    registerForm: FormGroup | undefined
    authService = inject(AuthService)

    constructor(private messageService: MessageService, private router: Router){

    }

    ngOnInit(){
      this.registerForm = new FormGroup({
        username: new FormControl(null,[Validators.required]),
        email: new FormControl(null,[Validators.required, Validators.email]),
        password: new FormControl(null,[Validators.required, Validators.minLength(8)]),
        confirm_password: new FormControl(null,[Validators.required, Validators.minLength(8)])
      })
    }
    
    async registerUser(){
      if(this.registerForm?.invalid){
        this.registerForm?.markAllAsTouched()
        return
      }
      if(this.registerForm?.get("password")?.value !== this.registerForm?.get("confirm_password")?.value){
        this.messageService.add({ severity: 'error', summary: 'Failed', detail: "Password and Confirm Password didn't matched" });
        return
      }
      this.isLoading = true
      try {
        const registering = await this.authService.register(this.registerForm?.get("username")?.value, this.registerForm?.get("email")?.value, this.registerForm?.get("password")?.value)
        setTimeout(()=>{
          this.router.navigate(["login"])
        },3000);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: "User Created Successfully" });
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Failed', detail: "Something went wrong" });
      } finally {
        this.isLoading = false
      }
      
    }
}
