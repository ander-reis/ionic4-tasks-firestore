import {Injectable} from '@angular/core';
import {AlertController, LoadingController, ToastController} from '@ionic/angular';
import {AlertOptions, LoadingOptions, ToastOptions} from '@ionic/core';

@Injectable({
    providedIn: 'root'
})
export class OverlayService {

    constructor(
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController
    ) {
    }

    /**
     * método alert
     * @AlertOptions options
     */
    async alert(options?: AlertOptions): Promise<HTMLIonAlertElement> {
        const alert = await this.alertCtrl.create(options);
        await alert.present();
        return alert;
    }

    /**
     * método loading
     * @LoadingOptions options
     */
    async loading(options?: LoadingOptions): Promise<HTMLIonLoadingElement> {
        const loading = await this.loadingCtrl.create({
            message: 'Loading...',
            ...options
        });
        await loading.present();
        return loading;
    }

    /**
     * método toast
     * @ToastOptions options
     */
    async toast(options?: ToastOptions): Promise<HTMLIonToastElement> {
        const toast = await this.toastCtrl.create({
            position: 'bottom',
            duration: 3000,
            showCloseButton: true,
            closeButtonText: 'Ok',
            ...options
        });
        await toast.present();
        return toast;
    }
}
