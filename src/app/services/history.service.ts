import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private history: string[] = [];

  addPattern(pattern: string): void {
    debugger;
    if (!this.history.includes(pattern)) {
      this.history.push(pattern);
    }
  }

  getHistory(): string[] {
    return this.history;
  }

  clearHistory(): void {
    this.history = [];
  }
}