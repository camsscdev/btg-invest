import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { OnlyNumbersDirective } from './only-number.directive';

@Component({
  template: `<input type="text" onlyNumbers />`,
  imports: [OnlyNumbersDirective],
})
class TestHostComponent {}

describe('OnlyNumbersDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let inputEl: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    inputEl = fixture.nativeElement.querySelector('input');
  });

  it('should create the host component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should allow numeric key presses', () => {
    const event = new KeyboardEvent('keydown', { key: '5', cancelable: true });
    inputEl.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });

  it('should block alphabetic key presses', () => {
    const event = new KeyboardEvent('keydown', { key: 'a', cancelable: true });
    inputEl.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('should allow Backspace key', () => {
    const event = new KeyboardEvent('keydown', { key: 'Backspace', cancelable: true });
    inputEl.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });

  it('should allow Tab key', () => {
    const event = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    inputEl.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });

  it('should allow ArrowLeft key', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true });
    inputEl.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });

  it('should allow ArrowRight key', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true });
    inputEl.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });

  it('should allow Delete key', () => {
    const event = new KeyboardEvent('keydown', { key: 'Delete', cancelable: true });
    inputEl.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });

  it('should block special characters', () => {
    const event = new KeyboardEvent('keydown', { key: '@', cancelable: true });
    inputEl.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('should block paste with non-numeric content', () => {
    const clipboardData = new DataTransfer();
    clipboardData.setData('text', 'abc123');
    const event = new ClipboardEvent('paste', { clipboardData, cancelable: true });
    inputEl.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('should allow paste with numeric content', () => {
    const clipboardData = new DataTransfer();
    clipboardData.setData('text', '12345');
    const event = new ClipboardEvent('paste', { clipboardData, cancelable: true });
    inputEl.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });
});
