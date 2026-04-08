import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[onlyNumbers]',
  standalone: true,
})
export class OnlyNumbersDirective {
  private allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.allowedKeys.includes(event.key)) return;

    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const pasteData = event.clipboardData?.getData('text') || '';

    if (!/^\d+$/.test(pasteData)) {
      event.preventDefault();
    }
  }
}
