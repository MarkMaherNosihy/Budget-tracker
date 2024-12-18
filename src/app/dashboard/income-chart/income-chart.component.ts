import { Component, inject, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { IncomeService } from '../../services/income.service';
import { IncomeResponse } from '../../types/income';

@Component({
  selector: 'app-income-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './income-chart.component.html',
  styleUrl: './income-chart.component.css'
})
export class IncomeChartComponent implements OnInit {
  totalIncome!: number;

  incomeService = inject(IncomeService);
  data: any;
  chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        
      }
    }
  };

  ngOnInit() {
    this.incomeService.getIncomes().subscribe(incomes => {
      const data = {
        labels: incomes.map(income => income.title),
        datasets: [
          {
            label: 'Income',
            data: incomes.map(income => income.amount),
            fill: true,
            backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#26C6DA', '#7E57C2', '#FF7043', '#78909C'],

          }
        ]
      };
      this.data = data;
      this.totalIncome = incomes.reduce((acc, income) => acc + income.amount, 0);
    });
  }


}
