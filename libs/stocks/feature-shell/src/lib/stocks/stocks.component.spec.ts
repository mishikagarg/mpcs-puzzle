import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksComponent } from './stocks.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatButtonModule } from '@angular/material';
import { SharedUiChartModule } from '@coding-challenge/shared/ui/chart';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

describe('StocksComponent', () => {
  let component: StocksComponent;
  let fixture: ComponentFixture<StocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StocksComponent],
      providers: [
        {
          provide: PriceQueryFacade, useValue: {
            priceQueries$: of([]),
            fetchQuote: jest.fn()
          }
        }
      ],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        SharedUiChartModule,
        MatDatepickerModule,
        MatNativeDateModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('detectChanges', () => {
    it('should get response if stockPickerForm is valid', () => {
      const dateFrom = new Date("2020-02-01");
      const dateTo = new Date("2020-02-05");
      component.stockPickerForm.patchValue({
        symbol: 'AAPL',
        dateFrom: dateFrom,
        dateTo: dateTo
      }, {
        emitEvent: true
      });
      fixture.detectChanges();
      component.fetchQuote();
      const priceQueryFacade: PriceQueryFacade = TestBed.get(PriceQueryFacade);
      expect(priceQueryFacade.fetchQuote).toHaveBeenCalledTimes(1);
    });

    it('should not get response if stockPickerForm is not valid and symbol is not entered', () => {
      const dateFrom = new Date("2020-02-01");
      const dateTo = new Date("2020-02-05");
      component.stockPickerForm.patchValue({
        dateFrom: dateFrom,
        dateTo: dateTo
      }, {
        emitEvent: true
      });
      component.fetchQuote();
      const priceQueryFacade: PriceQueryFacade = TestBed.get(PriceQueryFacade);
      expect(priceQueryFacade.fetchQuote).not.toHaveBeenCalled();
    });

    it('should nor get response if start and end date are not entered', () => {
      component.stockPickerForm.patchValue({
        symbol: 'AAPL'
      }, {
        emitEvent: true
      });
      component.fetchQuote();
      const priceQueryFacade: PriceQueryFacade = TestBed.get(PriceQueryFacade);
      expect(priceQueryFacade.fetchQuote).not.toHaveBeenCalled();
    });
  });

  describe('getEndDateChange', () => {
    it('should get end date if valid values are entered in the form.', () => {
      const dateFrom = new Date("2020-02-01");
      const dateTo = new Date("2020-02-05");
      component.stockPickerForm.controls['dateTo'].patchValue(dateTo);
      component.stockPickerForm.controls['dateFrom'].patchValue(dateFrom);
      component.getEndDateChange(component.stockPickerForm.controls['dateTo']);
      expect(component.stockPickerForm.controls['dateTo'].value.getDate()).toEqual(dateTo.getDate());
      expect(component.stockPickerForm.controls['dateTo'].value.getMonth()).toEqual(dateTo.getMonth());
      expect(component.stockPickerForm.controls['dateTo'].value.getFullYear()).toEqual(dateTo.getFullYear());
    });
  });
});
