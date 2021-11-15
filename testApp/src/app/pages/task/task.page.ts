import { Component, OnInit } from '@angular/core';
import { TasksService, Task } from 'src/app/services/tasks.service';
import { NavParams, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage implements OnInit {
  boardId = null;
  task: Task = {
    name: '',
    desc: '',
    color: '#399dff',
    priority: 'MEDIUM',
    due_date: Date.now(),
    assignee: null,
    attachements: []
  };
  // The ion-datetime expects an ISO string
  due = new Date().toISOString();
  members = [];
  colors = ['#65de2f', '#399dff', '#edbf4c', '#c2281d'];
  selectedAssignee = null;
  taskId = null;

  comment = '';
  comments = [];

  constructor(private navParams: NavParams, private tasksService: TasksService, private modalCtrl: ModalController, private toastCtrl: ToastController) { }

  ngOnInit() {
    this.boardId = this.navParams.data['boardId'];
    this.members = this.navParams.data['members'];
    this.taskId = this.navParams.data['taskId'];

    if (this.taskId) {
      this.loadTask();
    }
  }

  loadTask() {
    console.log('load data for: ', this.taskId);
    this.tasksService.getTask(this.taskId).subscribe(res => {
      this.comments = res['comments'];
      this.task = <Task>res;

      if (this.task.assignee) {
        for (let mem of this.members) {
          if (mem._id == this.task.assignee) {
            this.task.assignee = mem;
          }
        }
      }

      if (this.task.due_date) {
        this.due = new Date(this.task.due_date).toISOString();
      }
    })
  }

  save() {
    this.task.due_date = new Date(this.due).getTime();

    // The assignee is an object but for the saving we only need the ID!
    if (this.task.assignee) {
      this.task.assignee = this.task.assignee['_id'];
    }

    if (this.taskId) {
      this.tasksService.updateTask(this.taskId, this.task).subscribe(res => {
        this.toastCtrl.create({
          message: 'Task updated',
          position: 'top',
          duration: 2000
        }).then(toast => toast.present());

        this.modalCtrl.dismiss({ refresh: true });
      });
    } else {
      this.tasksService.addTask(this.boardId, this.task).subscribe(res => {
        this.toastCtrl.create({
          message: 'Task created',
          position: 'top',
          duration: 2000
        }).then(toast => toast.present());

        this.modalCtrl.dismiss({ refresh: true });
      });
    }
  }

  discard() {
    this.modalCtrl.dismiss();
  }

  selectColor(color) {
    this.task.color = color;
  }

  addComment() {
    this.tasksService.addTaskComment(this.taskId, this.comment).subscribe(res => {
      this.comment = '';
      this.loadTask();
    });
  }
}
