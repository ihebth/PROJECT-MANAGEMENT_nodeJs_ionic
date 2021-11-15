// boards.page.ts
import { AlertController, ToastController, PopoverController } from '@ionic/angular';
import { BoardsService } from './../../services/boards.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { InvitationsService } from 'src/app/services/invitations.service';
import { InvitationsPopoverPageModule } from '../invitations-popover/invitations-popover.module';
import { InvitationsPopoverPage } from '../invitations-popover/invitations-popover.page';

@Component({
  selector: 'app-boards',
  templateUrl: './boards.page.html',
  styleUrls: ['./boards.page.scss'],
})
export class BoardsPage implements OnInit {
  boards: Observable<any>;
  invitations = [];

  constructor(private boardsService: BoardsService, private alertCtrl: AlertController,
    private toastCtrl: ToastController, private invitationsService: InvitationsService, private popoverCtrl:PopoverController) { }

  ngOnInit() {
    this.loadBoards();
    this.loadInvitations();
  }

  loadBoards() {
    this.boards = this.boardsService.getBoards();
    this.boards.subscribe(res => {
      console.log('boards: ', res);
    });
  }

  async createBoard() {
    const alert = await this.alertCtrl.create({
      header: 'Start a new Board',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Name your Board'
        },
        {
          name: 'desc',
          type: 'text',
          placeholder: 'Description'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Create',
          handler: (data) => {
            this.boardsService.addBoard(data.name, data.desc).subscribe(res => {
              console.log('after add: ', res);
              this.loadBoards();
              this.toastCtrl.create({
                message: 'Board added',
                position: 'top',
                duration: 2000
              }).then(toast => toast.present());
            }, err => {
              this.showAlert('Creation failed', err.error.msg);
            });
          }
        }
      ]
    });

    alert.present();
  }

  async showAlert(title, msg) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: msg,
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    await alert.present();
  }

  loadInvitations() {
    this.invitationsService.getInvitations().subscribe(res => {
      console.log('invites: ', res);
      this.invitations = res;
    });
  }
  async showInvitations(ev) {
    const popover = await this.popoverCtrl.create({
      component: InvitationsPopoverPage,
      event: ev,
      componentProps: {
        invitations: this.invitations
      }
    });

    popover.onDidDismiss().then(data => {
      console.log('on dismiss: ', data);
      if (data && data.data && data.data['invite']) {
        this.invitationsService.answerInvitation(data.data['invite'], data.data['accept']).subscribe(res => {
          this.toastCtrl.create({
            message: 'Your answer has been sent',
            position: 'top',
            duration: 2000
          }).then(toast => toast.present());

          if (data.data['accept']) {
            this.loadBoards();
          }
          this.loadInvitations();
        }, err => {
          this.showAlert('Invite error', err.error.msg);
        });
      }
    })

    await popover.present();
  }

}