import { } from 'jasmine';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLinkDirectiveStub } from '../../test/stubs/router-link-directive-stub';
import { DetailsPage } from './details.page';
import { DetailsComponent } from './details.component';
import { AccountService } from '../account.service';
import { Account } from '../account';

const account = new Account(
  '098df4b4-d760-4aeb-8563-08d643737cff',
  'First Last',
  'First',
  'Last',
  'Email',
  '(123) 456-7890',
  false,
  false,
  new Date());
let component: DetailsComponent;
let fixture: ComponentFixture<DetailsComponent>;
let page: DetailsPage;
let routerLinks: RouterLinkDirectiveStub[];
let routerLinkDebugElements: DebugElement[];

/* tslint:disable-next-line:component-selector */
@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

describe('DetailsComponent', () => {

  beforeEach(() => setup());

  it('should have the account', () => {
    expect(component.account).toBe(account);
  });

  it('should display account details', () => {
    expect(page.firstName).toBe(component.account.firstName);
    expect(page.lastName).toBe(component.account.lastName);
    expect(page.email).toBe(component.account.email);
    expect(page.phoneNumber).toBe(component.account.phoneNumber);
    expect(page.phoneNumberConfirmed).toBe(component.account.phoneNumberConfirmed ? 'Yes' : 'No');
    expect(page.twoFactorEnabled).toBe(component.account.twoFactorEnabled ? 'Yes' : 'No');
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).toBe(1, 'should have 1 routerLink');
    expect(routerLinks[0].linkParams).toBe(`/Account/Edit/${account.id}`);
  });

  it('can click Account/Edit/:account.id link in template', () => {
    const createLinkDebugElement = routerLinkDebugElements[0];
    const createLink = routerLinks[0];

    expect(createLink.navigatedTo).toBeNull('should not have navigated yet');

    createLinkDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(createLink.navigatedTo).toBe(`/Account/Edit/${account.id}`);
  });

});

function setup() {
  TestBed.configureTestingModule({
    declarations: [
      DetailsComponent,
      RouterLinkDirectiveStub,
      RouterOutletStubComponent
    ],
    providers: [
      {
        provide: AccountService,
        useClass: class {
          account = new BehaviorSubject<Account>(account);
        }
      }
    ],
    imports: [
      HttpClientTestingModule,
      FontAwesomeModule
    ]
  });
  fixture = TestBed.createComponent(DetailsComponent);
  component = fixture.componentInstance;
  page = new DetailsPage(fixture);
  fixture.detectChanges();
  routerLinkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
  routerLinks = routerLinkDebugElements.map(de => de.injector.get(RouterLinkDirectiveStub));
}
