import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-estrelas-do-clube',
  templateUrl: './estrelas-do-clube.page.html',
  styleUrls: ['./estrelas-do-clube.page.scss'],
})
export class EstrelasDoClubePage implements OnInit {

  hideHeader: Boolean = false;
  aprendaList: any = [];

  constructor() { }

  ngOnInit() {
  }

}
