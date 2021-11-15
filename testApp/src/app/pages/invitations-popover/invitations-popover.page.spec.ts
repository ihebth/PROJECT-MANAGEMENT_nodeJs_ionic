import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationsPopoverPage } from './invitations-popover.page';

describe('InvitationsPopoverPage', () => {
  let component: InvitationsPopoverPage;
  let fixture: ComponentFixture<InvitationsPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationsPopoverPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationsPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
