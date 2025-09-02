import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendItemViewComponent } from './friend-item-view.component';

describe('FriendItemViewComponent', () => {
  let component: FriendItemViewComponent;
  let fixture: ComponentFixture<FriendItemViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FriendItemViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FriendItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
