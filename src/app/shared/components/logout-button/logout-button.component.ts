import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import {MenuController, NavController} from '@ionic/angular';
import {OverlayService} from '../../../core/services/overlay.service';

@Component({
    selector: 'app-logout-button',
    template: `
        <ion-buttons>
            <ion-button (click)="logout()">
                <ion-icon name="exit" slot="icon-only"></ion-icon>
            </ion-button>
        </ion-buttons>
    `,
})
export class LogoutButtonComponent implements OnInit {

    @Input() menu: string;

    constructor(
        private authService: AuthService,
        private menuCrl: MenuController,
        private navCtrl: NavController,
        private overlayService: OverlayService
    ) {
    }

    async ngOnInit(): Promise<void> {
        if (!(await this.menuCrl.isEnabled(this.menu))) {
            this.menuCrl.enable(true, this.menu);
        }
    }

    async logout(): Promise<void> {
        await this.overlayService.alert({
            message: 'Dou you really want to quit?',
            buttons: [
                {
                    text: 'Yes',
                    handler: async () => {
                        await this.authService.logout();
                        await this.menuCrl.enable(false, this.menu);
                        this.navCtrl.navigateRoot('/login');
                    }
                },
                'No'
            ]
        });
    }

}
