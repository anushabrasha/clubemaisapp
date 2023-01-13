import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Events } from '@ionic/angular';
import { ControlPanelService } from 'src/app/services/controlPanel/control-panel.service';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent implements OnInit {
  @Output() avatarChangeEvent = new EventEmitter<string>();
  @Input() data: any;
  @Input() eventListnerKey: string;
  showNameLabel = false;
  userNameLabel;
  avatarUrl;


  constructor(
    private events: Events,
    private ctrlPanel: ControlPanelService,
  ) { }

  ngOnInit() {
    if (this.data?.avatarURL) {
      this.avatarUrl = this.data.avatarURL;
    } else {
      this.avatarUrl = this.ctrlPanel.getLocalStorageData('foto');
    }
    this.getName();
    this.eventHandler();
  }

  eventHandler() {
    this.events.subscribe('updateProfilePic', (data) => {
      this.avatarUrl = data.foto;
    });
  }

  getName() {
    let name = this.data ? this.data.userName : this.ctrlPanel.getLocalStorageData('usermeta')['Nome'];
    if (name) {
      name = name.split(' ')
      let firstName = name[0];
      let lastName = name[1] ? name[1] : '';
      if (!lastName) {
        this.userNameLabel = firstName.charAt(0);
      } else {
        this.userNameLabel = firstName.charAt(0) + lastName.charAt(0)
      }
      this.checkAvatar()
    }
  }

  checkAvatar() {
    let avatarUrl = this.ctrlPanel.getLocalStorageData('foto');
    if (!avatarUrl || avatarUrl.includes('common/man')) {
      this.showNameLabel = true;
    } else {
      this.showNameLabel = false;
    }
  }

  changeAvatar() {
    this.avatarChangeEvent.emit();
  }
}
