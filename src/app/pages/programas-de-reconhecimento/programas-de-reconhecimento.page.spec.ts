import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProgramasDeReconhecimentoPage } from './programas-de-reconhecimento.page';

describe('ProgramasDeReconhecimentoPage', () => {
  let component: ProgramasDeReconhecimentoPage;
  let fixture: ComponentFixture<ProgramasDeReconhecimentoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramasDeReconhecimentoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramasDeReconhecimentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
