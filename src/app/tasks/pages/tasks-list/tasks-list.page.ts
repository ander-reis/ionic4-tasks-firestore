import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import {Task} from '../../models/task.model';
import {TasksService} from '../../services/tasks.service';
import {NavController} from '@ionic/angular';
import {OverlayService} from '../../../core/services/overlay.service';

@Component({
    selector: 'app-tasks-list',
    templateUrl: './tasks-list.page.html',
    styleUrls: ['./tasks-list.page.scss'],
})
export class TasksListPage implements OnInit {

    tasks$: Observable<Task[]>;

    constructor(
        private navCtrl: NavController,
        private overlayService: OverlayService,
        private tasksService: TasksService) {
    }

    async ngOnInit(): Promise<void> {
        // mock, dados para testes
        // this.tasks$ = of([
        //     {id: '457878', title: 'Aprender Ionic', done: false},
        //     {id: '485589', title: 'Aprender FirestoreClass', done: false},
        // ]);

        // loading
        const loading = await this.overlayService.loading();
        this.tasks$ = this.tasksService.getAll();
        this.tasks$.pipe(take(1)).subscribe(tasks => loading.dismiss());
    }

    /**
     * método responsável pelo redirecionamento do update para taks-save/update
     * @Taks task
     */
    onUpdate(task: Task): void {
        // 1ª forma `tasks/edit/${task.id}`
        this.navCtrl.navigateForward(['tasks', 'edit', task.id]);
    }

    /**
     * método delete task
     * @Task task
     */
    async onDelete(task: Task): Promise<void> {
        await this.overlayService.alert({
            message: `Do you really want to delete the task "${task.title}"`,
            buttons: [
                {
                    text: 'Yes',
                    handler: async () => {
                        await this.tasksService.delete(task);
                        await this.overlayService.toast({
                            message: `Task "${task.title}" deleted!`
                        });
                    }
                },
                'No'
            ]
        });
    }

    /**
     * método responsável por save/update done na task-list
     * @Task task
     */
    async onDone(task: Task): Promise<void> {
        const taskToUpdate = {...task, done: !task.done};
        await this.tasksService.update(taskToUpdate);
        await this.overlayService.toast({
            message: `Task "${task.title}" ${taskToUpdate.done ? 'completed' : 'updated'}!`
        });
    }
}
