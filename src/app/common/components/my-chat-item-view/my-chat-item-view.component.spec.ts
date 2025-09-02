import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyChatItemViewComponent } from './my-chat-item-view.component';

describe('MyChatItemViewComponent', () => {
  let component: MyChatItemViewComponent;
  let fixture: ComponentFixture<MyChatItemViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyChatItemViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyChatItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
