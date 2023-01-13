import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AprendaArchiveCardComponent } from './aprenda-archive-card.component';

describe('AprendaArchiveCardComponent', () => {
  let component: AprendaArchiveCardComponent;
  let fixture: ComponentFixture<AprendaArchiveCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AprendaArchiveCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AprendaArchiveCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
