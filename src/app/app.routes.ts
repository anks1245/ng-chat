import { Routes } from '@angular/router';
import { AuthGuard } from './security/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
    {
        path:'login',
        component: LoginComponent
    },
    {
        path:'register',
        component: RegisterComponent
    },
    {
        path:'chats',
        canActivate:[AuthGuard],
        loadComponent: ()=>import('./pages/chats/chats.component').then(m=>m.ChatsComponent),
        // children:[
        //     {
        //         path:'',

        //     }
        // ]
    },
    {
        path:'',
        pathMatch:'full',
        redirectTo:'login'
    },
];
