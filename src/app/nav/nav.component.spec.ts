import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { NavComponent } from './nav.component';
import { AuthService } from '../services/auth.service';
import {RouterTestingModule} from '@angular/router/testing'
import { By } from '@angular/platform-browser';

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  const mockedAuthService = jasmine.createSpyObj('AuthService',
  ['createUser', 'logout'], { isAuthenticated$ : of(true)})

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavComponent ],
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: mockedAuthService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should logout', () => {
    const logoutlink = fixture.debugElement.query(By.css('li:nth-child(3) a'))
    
    expect(logoutlink).withContext('not logged in').toBeTruthy()

    logoutlink.triggerEventHandler('click')

    const service = TestBed.inject(AuthService)
    expect(service.logout).withContext('Could not click logout')
    .toHaveBeenCalledTimes(1)

  })
});
