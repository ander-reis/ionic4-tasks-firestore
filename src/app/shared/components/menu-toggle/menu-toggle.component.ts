import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-menu-toggle',
    template: `
        <ion-buttons [menu]="menu">
            <ion-menu-toggle>
                <ion-button>
                    <ion-icon slot="icon-only" name="menu"></ion-icon>
                </ion-button>
            </ion-menu-toggle>
        </ion-buttons>
    `,
})
export class MenuToggleComponent {
    @Input() menu: string;
}
