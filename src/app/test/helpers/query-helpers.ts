import { ComponentFixture } from '@angular/core/testing';

export class QueryHelpers {
    static query<T>(fixture: ComponentFixture<any>, selector: string): T {
        return fixture.nativeElement.querySelector(selector);
    }

    static queryAll<T>(fixture: ComponentFixture<any>, selector: string): T[] {
        return fixture.nativeElement.querySelectorAll(selector);
    }
}
