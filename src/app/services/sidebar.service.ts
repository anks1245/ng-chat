import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private mobileSidebar = new BehaviorSubject<boolean>(true)
  private sidebar = new BehaviorSubject<boolean>(false)

  mobileSidebar$ = this.mobileSidebar.asObservable()
  sidebar$ = this.sidebar.asObservable()
  constructor() { }

  toggleMobileSidebar(){
    this.mobileSidebar.next(!this.mobileSidebar.value)
  }

  toggleSidebar(){
    this.sidebar.next(!this.sidebar.value)
  }
}
