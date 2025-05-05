import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegexService {
  validateRegex(pattern: string): boolean {
    try {
      new RegExp(pattern);
      return true;
    } catch {
      return false;
    }
  }

  matchPattern(pattern: string, testString: string): RegExpMatchArray | null {
    const regex = new RegExp(pattern, 'g');
    return testString.match(regex);
  }

  explainPattern(pattern: string): string {
    // This is a placeholder for regex explanation logic.
    // You can implement a more detailed explanation based on the regex pattern.
    return `Explanation for the regex pattern: ${pattern}`;
  }
}