import { Component } from '@angular/core';
import { UpperCasePipe, TitleCasePipe, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-pipe-demo',
  standalone: true,
  imports: [
    UpperCasePipe,
    TitleCasePipe,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './pipe-demo.html',
  styleUrls: ['./pipe-demo.css']
})
export class PipeDemoComponent {
  myName = 'bhoomika shivani';
  price = 49999;
  today = new Date();
}