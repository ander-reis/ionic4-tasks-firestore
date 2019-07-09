import {Injectable} from '@angular/core';
import {
    CanActivate,
    CanActivateChild,
    CanLoad,
    Router,
    Route,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlSegment
} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {take, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

    constructor(private authService: AuthService, private router: Router) {
    }

    /**
     * verifica se está autenticado e redireciona
     * @ActivatedSnapshot route
     * @RouterStateSnapShot state
     */
    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> {
        return this.checkAuthState(state.url);
    }

    /**
     * verifica se url filhos estão autenticados e redireciona
     * @ActivatedSnapshot route
     * @RouterStateSnapShot state
     */
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.canActivate(route, state);
    }

    /**
     * quando precisa carregar modulo de modo assincrono utilizando lazyload
     */
    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
        // segments: tasks/edit/9 = [tasks, edit, 9]
        // cria url
        const url = segments.map(s => `/${s}`).join('');
        return this.checkAuthState(url).pipe(take(1));
    }

    /**
     * método que verifica status auth user
     * @string redirect
     */
    private checkAuthState(redirectUrl: string): Observable<boolean> {
        return this.authService.isAuthenticated.pipe(
            tap(is => {
                if (!is) {
                    this.router.navigate(['/login'], {
                        queryParams: {redirect: redirectUrl} // /login?redirect=/tasks/create
                    });
                }
            })
        );
    }
}
