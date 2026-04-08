import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Founds } from './founds';
import { FoundsService } from '../../services/founds.service';
import { UserService } from '../../services/user.service';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { Funds } from '../../models/found';
import TEXTS from '../../data/texts.json';

describe('Founds', () => {
  let component: Founds;
  let fixture: ComponentFixture<Founds>;
  let foundsService: FoundsService;
  let userService: UserService;
  let messageService: MessageService;

  const mockFunds: Funds[] = [
    { id: '1', name: 'FPV_BTG_PACTUAL_RECAUDADORA', minimumAmount: 75000, returnRate: 3.2, type: 'FPV', description: 'Desc', amount: 0 },
    { id: '2', name: 'FPV_BTG_PACTUAL_ECOPETROL', minimumAmount: 125000, returnRate: 4.1, type: 'FPV', description: 'Desc', amount: 0 },
    { id: '3', name: 'DEUDAPRIVADA', minimumAmount: 50000, returnRate: 2.8, type: 'FIC', description: 'Desc', amount: 0 },
  ];

  const mockUser = { id: 1, name: 'Camilo', balance: 500000 };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Founds],
      providers: [MessageService, provideHttpClient()],
    }).compileComponents();

    foundsService = TestBed.inject(FoundsService);
    userService = TestBed.inject(UserService);
    messageService = TestBed.inject(MessageService);

    vi.spyOn(foundsService, 'get').mockReturnValue(of(mockFunds));
    vi.spyOn(userService, 'get').mockReturnValue(of(mockUser as any));

    fixture = TestBed.createComponent(Founds);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load funds on init', () => {
    expect(component.allFounds().length).toBe(3);
  });

  it('should load user on init', () => {
    expect(component.user()).toBeTruthy();
    expect(component.user().balance).toBe(500000);
  });

  it('should have title from texts.json', () => {
    expect(component.titleFounds()).toBe(TEXTS.founds.title);
  });

  it('should show all funds when no filter is selected', () => {
    foundsService.selectedTypes.set([]);
    expect(component.founds().length).toBe(3);
  });

  it('should filter funds by FPV type', () => {
    foundsService.selectedTypes.set(['FPV']);
    expect(component.founds().length).toBe(2);
    expect(component.founds().every(f => f.type === 'FPV')).toBe(true);
  });

  it('should filter funds by FIC type', () => {
    foundsService.selectedTypes.set(['FIC']);
    expect(component.founds().length).toBe(1);
    expect(component.founds()[0].type).toBe('FIC');
  });

  it('should show all funds when both types selected', () => {
    foundsService.selectedTypes.set(['FPV', 'FIC']);
    expect(component.founds().length).toBe(3);
  });

  it('should show error toast on user service error', () => {
    const spy = vi.spyOn(messageService, 'add');
    vi.spyOn(userService, 'get').mockReturnValue(throwError(() => new Error('fail')));
    component.getUser();
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error', summary: TEXTS.alerts.errorService })
    );
  });
});
