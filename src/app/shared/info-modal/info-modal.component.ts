import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.css']
})
export class InfoModalComponent implements AfterViewInit, OnChanges {
  @Input() message: string = 'Alapértelmezett üzenet.';
  @Input() title: string = 'Információ';
  @Input() messageType: 'success' | 'error' | 'info' | 'warning' = 'info'; // Üzenet típusa a stílusozáshoz
  @Input() showModal: boolean = false; // Bemeneti tulajdonság a megjelenítés vezérlésére

  @Output() closeModalEvent = new EventEmitter<void>();

  @ViewChild('infoDialog') dialog!: ElementRef<HTMLDialogElement>;

  ngAfterViewInit() {
    // Ha kezdetben meg kell jelennie, akkor itt hívjuk meg
    if (this.showModal) {
      this.openDialog();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Figyeljük a showModal változását, és ennek megfelelően nyitjuk/zárjuk a dialógust
    if (changes['showModal'] && this.dialog?.nativeElement) {
      if (this.showModal) {
        this.openDialog();
      } else {
        this.closeDialogInternal();
      }
    }
  }

  private openDialog(): void {
    if (this.dialog?.nativeElement && !this.dialog.nativeElement.open) {
      this.dialog.nativeElement.showModal();
    }
  }

  private closeDialogInternal(): void {
    if (this.dialog?.nativeElement && this.dialog.nativeElement.open) {
      this.dialog.nativeElement.close();
    }
  }

  // Ezt hívja meg a HTML-ben az OK gomb
  confirmAndClose(): void {
    this.closeDialogInternal();
    this.closeModalEvent.emit(); // Értesítjük a szülő komponenst a bezárásról
  }

  // Színosztályok az üzenet típusa alapján
  get titleClass(): string {
    switch (this.messageType) {
      case 'success': return 'title-success';
      case 'error': return 'title-error';
      case 'warning': return 'title-warning';
      default: return 'title-info';
    }
  }

  get messageClass(): string {
    switch (this.messageType) {
      case 'success': return 'message-success';
      case 'error': return 'message-error';
      case 'warning': return 'message-warning';
      default: return 'message-info';
    }
  }
}
