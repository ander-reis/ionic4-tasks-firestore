import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TasksService} from '../../services/tasks.service';
import {NavController} from '@ionic/angular';
import {OverlayService} from '../../../core/services/overlay.service';
import {ActivatedRoute} from '@angular/router';
import {take} from 'rxjs/operators';

@Component({
    selector: 'app-task-save',
    templateUrl: './task-save.page.html',
    styleUrls: ['./task-save.page.scss'],
})
export class TaskSavePage implements OnInit {

    taskForm: FormGroup;
    pageTitle = '...';
    taskId: string = undefined;

    constructor(
        private fb: FormBuilder,
        private navCtrl: NavController,
        private overlayService: OverlayService,
        private route: ActivatedRoute,
        private taskService: TasksService) {
    }

    ngOnInit(): void {
        this.createForm();
        this.init();
    }

    /**
     * método responsável por receber id para edit e popular form para edit
     */
    init(): void {
        const taskId = this.route.snapshot.paramMap.get('id');
        if (!taskId) {
            this.pageTitle = 'Create Task';
            return;
        }

        this.taskId = taskId;
        console.log('taskId: ', taskId);
        this.pageTitle = 'Edit Task';
        this.taskService.get(taskId)
            .pipe(take(1))
            .subscribe(({title, done}) => {
                this.taskForm.get('title').setValue(title);
                this.taskForm.get('done').setValue(done);
            });
    }

    /**
     * valida form
     */
    private createForm(): void {
        this.taskForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(3)]],
            done: [false]
        });
    }

    /**
     * cadastra task e editar task
     */
    async onSubmit(): Promise<void> {
        // console.log('Taks: ', this.taskForm.value);
        const loading = await this.overlayService.loading({
            message: 'Saving...'
        });
        try {
            const task = !this.taskId
            ? await this.taskService.create(this.taskForm.value)
            : await this.taskService.update({
                id: this.taskId,
                ...this.taskForm.value
            });
            console.log('Task saved: ', task);
            this.navCtrl.navigateBack('/tasks');
        } catch (error) {
            console.log('Error saving Task: ', error);
            await this.overlayService.toast({
                message: error.message
            });
        } finally {
            loading.dismiss();
        }
    }
}
