import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-invitations-popover',
  templateUrl: './invitations-popover.page.html',
  styleUrls: ['./invitations-popover.page.scss'],
})
export class InvitationsPopoverPage implements OnInit {

  invitations = [];

  constructor(private navParams: NavParams, private popoverCtrl: PopoverController) { }

  ngOnInit() {
    this.invitations = this.navParams.get('invitations');
  }

  acceptInvite(invite, accept) {
    this.popoverCtrl.dismiss({ invite: invite._id, accept });
  }

}
