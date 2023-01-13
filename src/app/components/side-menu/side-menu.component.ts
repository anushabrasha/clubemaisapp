import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {


  public appPages = [
    {
      title: 'Programa',
      url: '/dash-board',
    },
    {
      title: 'Performance',
      url: '/dash-board',
    },
    {
      title: 'Resgate',
      url: '/dash-board',
    },
    {
      title: 'Missões ',
      url: '/dash-board',
    },
    {
      title: 'Treinamentos',
      url: '/dash-board',
    },
    {
      title: 'Selos',
      url: '/dash-board',
    },
    {
      title: 'Fale Conosco ',
      url: '/dash-board',
    }
  ];

  public userPages = [
    {
      title: 'Extrato',
      url: '/dash-board',
    },
    {
      title: 'Minha conta',
      url: '/dash-board',
    },
    {
      title: 'Sair',
      url: '/login-page',
    },
  ];

  constructor() { }

  ngOnInit() { }

}
