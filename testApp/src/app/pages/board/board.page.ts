import { BoardsService } from './../../services/boards.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController, AlertController, ModalController } from '@ionic/angular';
import { InvitationsService } from 'src/app/services/invitations.service';
import { TaskPage } from '../task/task.page';

@Component({
  selector: 'app-board',
  templateUrl: './board.page.html',
  styleUrls: ['./board.page.scss'],
})
export class BoardPage implements OnInit {
  board = null;
  boardId = null;

  constructor(private activatedRoute: ActivatedRoute, private boardsService: BoardsService, private toastCtrl: ToastController,
    private alertCtrl: AlertController, private invitationsService: InvitationsService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.boardId = this.activatedRoute.snapshot.paramMap.get('id');
    this.loadBoard();
  }

  loadBoard() {
    this.boardsService.getBoardById(this.boardId).subscribe(res => {
      console.log('my board: ', res);
      this.board = res;
    });
  }

  updateBoard() {
    this.boardsService.updateBoard(this.board._id, this.board.name, this.board.desc).subscribe(res => {
      this.board = res;
      this.toastCtrl.create({
        message: 'Board updated',
        position: 'top',
        duration: 2000
      }).then(toast => toast.present());
    });
  }

  async inviteMember() {
    const alert = await this.alertCtrl.create({
      header: 'Invite a User',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email of the User'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Invite',
          handler: (data) => {
            this.invitationsService.inviteUser(this.board._id, data.email).subscribe(res => {
              this.toastCtrl.create({
                message: 'User invited',
                position: 'top',
                duration: 2000
              }).then(toast => {
                toast.present();
              });
            }, err => {
              let msg = err.error ? err.error.msg : 'Please try again later';
              this.showAlert(msg);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async showAlert(msg) {
    const alert = await this.alertCtrl.create({
      header: 'Invite failed',
      message: msg,
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    await alert.present();
  }

  async createTask(taskId = null) {
    const modal = await this.modalCtrl.create({
      component: TaskPage,
      componentProps: {
        boardId: this.boardId,
        taskId: taskId,
        members: [this.board.creator, ...this.board.users]
      }
    });
    modal.onDidDismiss().then(res => {
      if (res && res.data && res.data['refresh']) {
        this.loadBoard();
      }
    });
    modal.present();
  }

  solveTask(e, task) {
    e.stopPropagation();

    this.boardsService.deleteTaskInBoard(this.boardId, task._id).subscribe(res => {
      this.toastCtrl.create({
        message: 'Another task finished',
        position: 'top',
        duration: 2000
      }).then(toast => {
        toast.present();
      });
      this.loadBoard();
    }, err => {
      let msg = err.error ? err.error.msg : 'Please try again later';
      this.showAlert(msg);
    })
  }
}