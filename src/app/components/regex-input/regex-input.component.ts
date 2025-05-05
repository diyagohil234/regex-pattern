import { Component } from '@angular/core';
import { HistoryService } from '../../services/history.service';
import { RegexService } from '../../services/regex.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as RandExp from 'randexp';

@Component({
  selector: 'app-regex-input',
  templateUrl: './regex-input.component.html',
  styleUrls: ['./regex-input.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class RegexInputComponent {
  regexPattern: string = ''; // Stores the regex pattern entered by the user
  testString: string = ''; // Stores the test string entered by the user
  matches: string = ''; // Stores the result of the regex test
  explanation: string = ''; // Stores the explanation of the regex pattern
  history: string[] = []; // Stores the history of tested regex patterns
  examples: string = ''; // Stores generated examples based on the regex pattern

  constructor(private regexService: RegexService, private historyService: HistoryService) {}

  /**
   * Sanitizes user input to prevent invalid characters or HTML injection.
   * @param field - The field to sanitize ('regexPattern' or 'testString').
   */
  sanitizeInput(field: string): void {
    if (field === 'regexPattern') {
      // Remove any characters that are not valid in a regex pattern
      this.regexPattern = this.regexPattern.replace(/[^a-zA-Z0-9^$.*+?()[\]{}|\\]/g, '');
    } else if (field === 'testString') {
      // Remove any HTML tags from the test string
      this.testString = this.testString.replace(/<[^>]*>/g, '');
    }
  }

    /**
   * Validates the regex pattern and tests it against the test string.
   * Updates the explanation, history, and matches accordingly.
   */
    validateAndTest() {
      this.explanation = ''; // Clear previous explanation
      if (this.regexService.validateRegex(this.regexPattern)) {
        // Generate explanation for the regex pattern
        this.explanation = this.explainPattern(this.regexPattern);
        console.log("this.explanation", this.explanation);
  
        // Add the pattern to history and reload it
        this.historyService.addPattern(this.regexPattern);
        this.loadHistory();
  
        // Generate examples based on the regex pattern
        this.generateExamples();
  
        // Check if the regex pattern is valid
        if (this.isRegexValid(this.regexPattern)) {
          // Test if the test string matches the regex pattern
          if (this.doesStringMatch(this.regexPattern, this.testString)) {
            this.matches = '✅ Valid string of the regex pattern';
            console.log('✅ Valid match!');
          } else {
            this.matches = '❌ Invalid string of the regex pattern';
            console.log('❌ String does not match pattern.');
          }
        } else {
          this.matches = '';
          this.explanation = '⚠️ Invalid regex pattern.';
          console.log('⚠️ Invalid regex pattern.');
        }
      } else {
        this.matches = '';
        this.explanation = '⚠️ Invalid regex pattern.';
      }
    }
  
  /**
   * Loads the history of tested regex patterns from the HistoryService.
   */
  loadHistory(): void {
    const newHistory = this.historyService.getHistory();
    if (Array.isArray(newHistory)) {
      this.history = newHistory;
    } else {
      console.warn('No valid history found, keeping existing history');
    }
    console.log('Updated history:', this.history);
  }

  /**
   * Validates if the given regex pattern is valid.
   * @param regexPattern - The regex pattern to validate.
   * @returns True if the pattern is valid, false otherwise.
   */
  validateRegexPattern(regexPattern: string): boolean {
    try {
      new RegExp(regexPattern); // Try creating a RegExp object
      return true;
    } catch (error) {
      return false;
    }
  }


  /**
   * Checks if the regex pattern is valid.
   * @param pattern - The regex pattern to check.
   * @returns True if the pattern is valid, false otherwise.
   */
  isRegexValid(pattern: string): boolean {
    try {
      new RegExp(pattern);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  /**
   * Tests if the given string matches the regex pattern.
   * @param pattern - The regex pattern.
   * @param value - The string to test.
   * @returns True if the string matches, false otherwise.
   */
  doesStringMatch(pattern: string, value: string): boolean {
    try {
      const regex = new RegExp(pattern);
      return regex.test(value); // True if it matches
    } catch (e) {
      return false;
    }
  }
  
  /**
   * Provides an explanation for the given regex pattern.
   * @param pattern - The regex pattern to explain.
   * @returns A string explaining the pattern.
   */
  explainPattern(pattern: string): string {
    const explanations: { [key: string]: string } = {
      '^': 'Start of string',
      '$': 'End of string',
      '.': 'Any character except newline',
      '\\d': 'Digit (0-9)',
      '\\w': 'Word character (a-z, A-Z, 0-9, _)',
      '\\s': 'Whitespace',
      '+': 'One or more times',
      '*': 'Zero or more times',
      '?': 'Zero or one time',
      '{n}': 'Exactly n times',
      '{n,}': 'At least n times',
      '{n,m}': 'Between n and m times',
      '|': 'Or',
      '()': 'Capture group',
      '[]': 'Character class',
      '@': 'At symbol (used in emails)',
      '\\.': 'Dot (.) character',
      '-': 'Hyphen/minus sign',
    };

    let explanation = 'Pattern Explanation:\n';
    for (const key in explanations) {
      if (pattern.includes(key)) {
        explanation += `- ${key} : ${explanations[key]}\n`;
      }
    }

    return explanation.trim() || 'No explanation available.';
  }

  /**
   * Generates example strings based on the regex pattern using RandExp.
   */
  private generateExamples() {
    try {
      const re = new RandExp(this.regexPattern);
      this.examples = re.gen();
      console.log('Generated example:', this.examples);
    } catch (e) {
      this.examples = 'Invalid regex';
    }
  }

  getVisualizationUrl(): string {
    const encodedPattern = encodeURIComponent(this.regexPattern);
    console.log('Encoded pattern for visualization:', encodedPattern);
    return `https://regexper.com/#${encodedPattern}`;
  }
  
}