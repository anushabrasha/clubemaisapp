import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PremiereMissionDashboardPagePage } from './premiere-mission-dashboard-page.page';

describe('PremiereMissionDashboardPagePage', () => {
  let component: PremiereMissionDashboardPagePage;
  let fixture: ComponentFixture<PremiereMissionDashboardPagePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiereMissionDashboardPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PremiereMissionDashboardPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
