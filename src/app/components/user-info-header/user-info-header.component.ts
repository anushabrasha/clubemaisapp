import { Component, OnInit, Input } from '@angular/core';
import { DataHolderService } from 'src/app/services/dataHolder/data-holder.service';

@Component({
  selector: 'app-user-info-header',
  templateUrl: './user-info-header.component.html',
  styleUrls: ['./user-info-header.component.scss'],
})
export class UserInfoHeaderComponent implements OnInit {
  @Input() pageKey: any;
  @Input() missionBannerImage: any;
  @Input() hideUserInfo: any

  constructor(
    private dataHolder: DataHolderService
  ) { }

  ngOnInit() {
  }

  getPageTitle(key) {
    let holder = this.dataHolder.pageTitleHolder[key];
    return holder.title ? holder.title : '';
  }

  getPageSubTitle(key) {
    let holder = this.dataHolder.pageTitleHolder[key];
    return holder.subTitle ? holder.subTitle : '';
  }

  getPageImage(key) {
    let holder = this.dataHolder.pageTitleHolder[key];
    if (this.missionBannerImage) {
      return this.missionBannerImage;
    } else {
      return holder.img ? holder.img : '';
    }
  }


  setclass() {
    let ngClass = '';
    if (this.hideUserInfo) {
      switch (this.pageKey) {
        case 'profile':
          ngClass = 'register-page';
          break;
        case 'fale-conoso':
        case 'faq':
          ngClass = 'unlog-in';
          break;
        default:
          ngClass = '';
          break;
      }
    }
    return ngClass;
  }
}
