import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddressService } from '../../address/address.service';
import { ShippingAddressComponent } from './shipping-address.component';
import { Address } from '../../address/address';

describe('ShippingAddressComponent', () => {
  let component: ShippingAddressComponent;
  let fixture: ComponentFixture<ShippingAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        ShippingAddressComponent
      ],
      providers: [
        {
          provide: NgbActiveModal,
          useValue: jasmine.createSpyObj('NgbActiveModal', ['close'])
        },
        {
          provide: ToastrService,
          useValue: jasmine.createSpyObj('ToastrService', ['error'])
        },
        {
          provide: AddressService,
          useValue: jasmine.createSpyObj('AddressService', ['validate'])
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingAddressComponent);
    component = fixture.componentInstance;
    component.shippingAddress = new Address();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
