import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase/app';
import {AuthOptions, AuthProvider, User} from './auth.types';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    authState$: Observable<firebase.User>;

    constructor(private afAuth: AngularFireAuth) {
        this.authState$ = this.afAuth.authState;
    }

    /**
     * verifica se está autenticado
     */
    get isAuthenticated(): Observable<boolean> {
        return this.authState$.pipe(map(user => user !== null));
    }

    /**
     * método responsável por verificar qual é o tipo de autenticação
     * @AuthOptions isSignIn
     * @AuthOptions provider
     * @AuthOptions user
     */
    authenticate({isSignIn, provider, user}: AuthOptions): Promise<auth.UserCredential> {
        let operation: Promise<auth.UserCredential>;

        if (provider !== AuthProvider.Email) {
            operation = this.signInWithPopup(provider);
        } else {
            operation = isSignIn ? this.signInWithEmail(user) : this.signUpWithEmail(user);
        }

        return operation;
    }

    /**
     * logout
     */
    logout(): Promise<void> {
        return this.afAuth.auth.signOut();
    }

    /**
     * autenticação por email/firebase
     * @User email
     * @User password
     */
    private signInWithEmail({email, password}: User): Promise<auth.UserCredential> {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    }

    /**
     * cadastrar user firebase
     * @User email
     * @User password
     * @User name
     */
    private signUpWithEmail({email, password, name}: User): Promise<auth.UserCredential> {
        return this.afAuth.auth
            .createUserWithEmailAndPassword(email, password)
            .then(credentials => credentials.user
                .updateProfile({displayName: name, photoURL: null})
                .then(() => credentials)
            );
    }

    /**
     * autenticar por facebook
     * @AuthProvider provider
     */
    private signInWithPopup(provider: AuthProvider): Promise<auth.UserCredential> {
        let signProvider = null;

        switch (provider) {
            case AuthProvider.Facebook:
                signProvider = new auth.FacebookAuthProvider();
                break;
        }

        return this.afAuth.auth.signInWithPopup(signProvider);
    }
}
