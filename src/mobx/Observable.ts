import {createAtom, IAtom} from "mobx";

export class Observable<T = unknown> {
    private atom: IAtom
    private _value: T;
    constructor(value: T, name = '') {
        this.atom = createAtom(name);
        this._value = value;
    }

    get value(): T {
        this.atom.reportObserved();
        return this._value;
    }

    set value(value: T) {
        this._value = value;
        this.atom.reportChanged();
    }
}