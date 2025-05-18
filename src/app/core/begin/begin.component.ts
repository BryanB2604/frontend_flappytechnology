import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-begin',
  standalone: false,
  templateUrl: './begin.component.html',
  styleUrl: './begin.component.css'
})
export class BeginComponent {
  constructor( private router: Router) {}

  goToLogin() {
    this.router.navigate(['/tienda']);
  }

}
