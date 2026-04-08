import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach } from 'vitest';
import { Navbar } from './navbar';
import TEXTS from '../../data/texts.json';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have texts loaded from JSON', () => {
    expect(component.texts).toBeDefined();
    expect(component.texts.navbar).toBeDefined();
  });

  it('should render explore link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('a');
    const exploreLink = Array.from(links).find(a => a.textContent?.includes(TEXTS.navbar.explore));
    expect(exploreLink).toBeTruthy();
  });

  it('should render history link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('a');
    const historyLink = Array.from(links).find(a => a.textContent?.includes(TEXTS.navbar.history));
    expect(historyLink).toBeTruthy();
  });

  it('should render the BTG Pactual logo text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('BTG Pactual');
  });

  it('should have a nav element', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const nav = compiled.querySelector('nav');
    expect(nav).toBeTruthy();
  });
});
