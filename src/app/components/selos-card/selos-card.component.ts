import { Component, OnInit, Input } from '@angular/core';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-selos-card',
  templateUrl: './selos-card.component.html',
  styleUrls: ['./selos-card.component.scss'],
})
export class SelosCardComponent implements OnInit {
  @Input() list: any;
  @Input() toList: number;

  slideConfig = {
    "dots": false,
    "initialSlide": 1,
    "slidesToShow": 2,
    "slidesToScroll": 1,
    "infinite": false,
    // "focusOnSelect": true,
    "centerMode": true,
    "nextArrow": "",
    "prevArrow": "",
    "centeredSlides": true,
  };
  constructor(
    private events: Events,
  ) { }

  ngOnInit() {

  }

  ngOnChanges() {
    this.slideConfig.slidesToShow = this.toList;
  }

  openPopUp(selected) {
    this.events.publish('selos:toTriggerPopup', selected);
  }
}
