import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VantagensPage } from './vantagens.page';

describe('VantagensPage', () => {
  let component: VantagensPage;
  let fixture: ComponentFixture<VantagensPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VantagensPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VantagensPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
