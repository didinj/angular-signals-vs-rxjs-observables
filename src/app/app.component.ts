import { Component, computed, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { CounterService } from './counter.service';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <h1>Angular Signals vs RxJS Observables</h1>
    
    <h2>Signal Counter</h2>
    <p>Count: {{ counterService.count() }}</p>
    <p>Double Count (computed): {{ doubleCount() }}</p>
    <button (click)="counterService.increment()">+</button>

    <h2>Observable Counter</h2>
    <p>Count: {{ count$ | async }}</p>
    <p>Double Count: {{ doubleCount$ | async }}</p>
    <button (click)="increment()">+</button>

    <h2>Users from HTTP (toSignal)</h2>
    <ul><li *ngFor="let user of users()">{{ user.name }}</li></ul>
  `,
  imports: [],
})
export class AppComponent {
  counterService = inject(CounterService);

  doubleCount = computed(() => this.counterService.count() * 2);

  // Observable counter setup
  private countSubject = signal(0);
  count$ = toSignal(this.countSubject.asObservable(), { initialValue: 0 });
  doubleCount$ = toSignal(this.countSubject.asObservable().pipe(map(c => c * 2)), { initialValue: 0 });
  increment() {
    this.countSubject.set(this.countSubject() + 1);
  }

  // HTTP Example using toSignal
  users = toSignal(inject(HttpClient).get<any[]>('https://jsonplaceholder.typicode.com/users'), {
    initialValue: [],
  });

  constructor() {
    effect(() => {
      console.log('Signal Counter:', this.counterService.count());
    });
  }
}