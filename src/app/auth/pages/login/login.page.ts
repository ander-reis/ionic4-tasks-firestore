import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../core/services/auth.service';
import {AuthProvider} from '../../../core/services/auth.types';
import {OverlayService} from '../../../core/services/overlay.service';
import {NavController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    authForm: FormGroup;
    authProviders = AuthProvider;
    configs = {
        isSignIn: true,
        action: 'Login',
        actionChange: 'Create account'
    };
    private nameControll = new FormControl('', [Validators.required, Validators.minLength(3)]);

    constructor(
        private authService: AuthService,
        private fb: FormBuilder,
        private overlayService: OverlayService,
        private navCtrl: NavController,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        this.createForm();
    }

    /**
     * valida form
     */
    private createForm(): void {
        this.authForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    /**
     * recebe name
     */
    get name(): FormControl {
        return <FormControl> this.authForm.get('name');
    }

    /**
     * recebe email
     */
    get email(): FormControl {
        return <FormControl> this.authForm.get('email');
    }

    /**
     * recebe password
     */
    get password(): FormControl {
        return <FormControl> this.authForm.get('password');
    }

    /**
     * altera ação auth
     */
    changeAuthAction(): void {
        this.configs.isSignIn = !this.configs.isSignIn;
        const {isSignIn} = this.configs;
        this.configs.action = isSignIn ? 'Login' : 'Sign Up';
        this.configs.actionChange = isSignIn ? 'Create account' : 'Already have an account';
        !isSignIn ? this.authForm.addControl('name', this.nameControll) : this.authForm.removeControl('name');
    }

    /**
     * recebe submit
     */
    async onSubmit(provider: AuthProvider): Promise<void> {
        // habilita loading
        const loading = await this.overlayService.loading();
        try {
            const credentials = await this.authService.authenticate({
                isSignIn: this.configs.isSignIn,
                user: this.authForm.value,
                provider
            });

            // console.log('AuthForm', this.authForm.value);
            // console.log('Authenticated', credentials);

            this.navCtrl.navigateForward(this.route.snapshot.queryParamMap.get('redirect') || '/tasks');
        } catch (e) {
            console.log('Auth error: ', e);
            // habilita toast
            await this.overlayService.toast({message: e.message});
        } finally {
             // encerra loading
            loading.dismiss();
        }
    }
}
