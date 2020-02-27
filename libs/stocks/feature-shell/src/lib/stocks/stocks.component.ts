import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})

export class StocksComponent implements OnInit {
  stockPickerForm: FormGroup;
  maxLimitDate = new Date();
  quotes$ = this.priceQuery.priceQueries$;

  constructor(private fb: FormBuilder,
    private priceQuery: PriceQueryFacade) {
  }

  ngOnInit() {
    this.getStockPickerForm();
  }

  // intialize the formgroup
  getStockPickerForm(): void {
    this.stockPickerForm = this.fb.group({
      symbol: [null, Validators.required],
      dateFrom: [null, Validators.required],
      dateTo: [null, Validators.required]
    });
  }

  fetchQuote(): void {
    if (this.stockPickerForm.valid) {
      const { symbol, dateFrom, dateTo } = this.stockPickerForm.value;
      if (dateFrom && dateTo) {
        this.priceQuery.fetchQuote(symbol, dateFrom, dateTo);
      }
      else {
        console.log("No time-frame selected");
      }
    }
  }

  public getStartDateChange(date): void {
    const getToDate = date.value.getTime()
    const dateTo = this.stockPickerForm.controls.dateTo.value;
    if (dateTo) {
      if (getToDate > dateTo.getTime()) {
        this.stockPickerForm.controls.dateFrom.patchValue(dateTo)
      };
    }
  }

  public getEndDateChange(date): void {
    const getEndDate = date.value.getTime()
    const dateFrom = this.stockPickerForm.controls.dateFrom.value;
    if (dateFrom) {
      if (getEndDate < dateFrom.getTime()) {
        this.stockPickerForm.controls.dateTo.patchValue(dateFrom)
      }
    }
  }
}
