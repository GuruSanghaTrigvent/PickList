import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PicklistComponent } from './components/picklist/picklist.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PicklistComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'anglr';
}
