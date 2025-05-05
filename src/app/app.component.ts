import { Component } from '@angular/core';
import { RegexInputComponent } from './components/regex-input/regex-input.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true, // Mark the component as standalone
  imports: [
        RegexInputComponent,
      ]
    
  })
export class AppComponent {
  title = 'my-angular-app';
}
