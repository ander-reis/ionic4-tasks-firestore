import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import {NavController} from '@ionic/angular';
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

    constructor(
        private authService: AuthService,
        private navCtrl: NavController,
        private overlayService: OverlayService
    ) {
    }

    ngOnInit() {
    }

    async logout(): Promise<void> {
        await this.overlayService.alert({
            message: 'Dou you really want to quit?',
            buttons: [
                {
                    text: 'Yes',
                    handler: async () => {
                        await this.authService.logout();
                        this.navCtrl.navigateRoot('/login');
                    }
                },
                'No'
            ]
        });
    }

}
