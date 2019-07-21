import {AngularFirestore, AngularFirestoreCollection, QueryFn} from '@angular/fire/firestore';
import {Observable} from 'rxjs';

export abstract class Firestore<T extends { id: string }> {

    protected collection: AngularFirestoreCollection<T>;

    constructor(protected db: AngularFirestore) {
    }

    /**
     * configura collection
     * @string path
     * @queryFn queryFn
     */
    protected setCollection(path: string, queryFn?: QueryFn) {
        this.collection = path ? this.db.collection(path, queryFn) : null;
    }

    /**
     * configura para retorna registro
     * @T item
     * @string operation
     */
    private setItem(item: T, operation: string): Promise<T> {
        return this.collection
            .doc<T>(item.id)
            [operation](item)
            .then(() => item);
    }

    /**
     * busca todos registros
     */
    getAll(): Observable<T[]> {
        return this.collection.valueChanges();
    }

    /**
     * busca registro por id
     * @string id
     */
    get(id: string): Observable<T> {
        return this.collection.doc<T>(id).valueChanges();
    }

    /**
     * cria registro
     * @T item
     */
    create(item: T): Promise<T> {
        // cria id
        item.id = this.db.createId();
        return this.setItem(item, 'set');
    }

    /**
     * atualiza registro
     * @T item
     */
    update(item: T): Promise<T> {
        return this.setItem(item, 'update');
    }

    /**
     * deleta registro
     * @T item
     */
    delete(item: T): Promise<void> {
        return this.collection.doc<T>(item.id).delete();
    }
}
