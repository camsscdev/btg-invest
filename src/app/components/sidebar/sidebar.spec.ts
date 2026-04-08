import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach } from 'vitest';
import { Sidebar } from './sidebar';
import { FoundsService } from '../../services/founds.service';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;
  let foundsService: FoundsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    foundsService = TestBed.inject(FoundsService);
    foundsService.selectedTypes.set([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have texts loaded from JSON', () => {
    expect(component.texts).toBeDefined();
    expect(component.texts.sidebar).toBeDefined();
  });

  it('should add type when toggleType is called with checked=true', () => {
    component.toggleType('FIC', { checked: true });
    expect(foundsService.selectedTypes()).toContain('FIC');
  });

  it('should remove type when toggleType is called with checked=false', () => {
    foundsService.selectedTypes.set(['FIC', 'FPV']);
    component.toggleType('FIC', { checked: false });
    expect(foundsService.selectedTypes()).not.toContain('FIC');
    expect(foundsService.selectedTypes()).toContain('FPV');
  });

  it('should add multiple types', () => {
    component.toggleType('FIC', { checked: true });
    component.toggleType('FPV', { checked: true });
    expect(foundsService.selectedTypes()).toEqual(['FIC', 'FPV']);
  });

  it('should render FIC and FPV checkboxes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const checkboxes = compiled.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes.length).toBe(2);
  });

  it('should have empty selectedTypes initially', () => {
    expect(foundsService.selectedTypes().length).toBe(0);
  });
});
