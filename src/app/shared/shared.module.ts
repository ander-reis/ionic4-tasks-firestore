import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {MenuToggleComponent} from './components/menu-toggle/menu-toggle.component';
import {LogoutButtonComponent} from './components/logout-button/logout-button.component';
import {IonicModule} from '@ionic/angular';

@NgModule({
    declarations: [LogoutButtonComponent, MenuToggleComponent],
    imports: [IonicModule],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        IonicModule,
        MenuToggleComponent,
        LogoutButtonComponent
    ]
})
export class SharedModule {
}
