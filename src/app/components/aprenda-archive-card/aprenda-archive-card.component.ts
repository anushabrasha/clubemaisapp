import { Component, OnInit, Input } from '@angular/core';
import { Events } from '@ionic/angular';

import * as moment from 'moment';

@Component({
  selector: 'app-aprenda-archive-card',
  templateUrl: './aprenda-archive-card.component.html',
  styleUrls: ['./aprenda-archive-card.component.scss'],
})
export class AprendaArchiveCardComponent implements OnInit {
  @Input() list: any;
  @Input() isFor: any;

  aprendaList = [];
  constructor(
    private events: Events,
  ) { }

  ngOnInit() {
    this.eventHandler();
  }

  ngOnDestroy() {
    this.events.unsubscribe('aprenda:list');
  }

  eventHandler() {
    this.events.subscribe('aprenda:list', (list) => {
      this.aprendaList = list;
    });
  }

  renderDate(aprenda) {
    return moment(aprenda.date).format("DD/MM/YYYY");
  }

  openCourse(aprenda) {
    this.events.publish('archivePage:toSinglePage', aprenda);
  }
}
