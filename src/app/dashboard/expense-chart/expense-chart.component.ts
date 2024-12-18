import { Component, inject } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ExpenseService } from '../../services/expense.service';
import { BudgetService } from '../../services/budget.service';

@Component({
  selector: 'app-expense-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './expense-chart.component.html',
  styleUrl: './expense-chart.component.css'
})
export class ExpenseChartComponent {
  barChartData: any;
  barChartOptions: any;

  constructor(private budgetService: BudgetService) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  loadChartData() {
    this.budgetService.getIncomeTotal().subscribe((income) => {
      this.budgetService.getExpensesTotal().subscribe((expenses) => {
        this.barChartData = {
          labels: ['Total Income vs Expenses'],
          datasets: [
            {
              label: 'Income',
              backgroundColor: '#42A5F5',
              data: [income],
            },
            {
              label: 'Expenses',
              backgroundColor: '#FFA726',
              data: [expenses],
            },
          ],
        };
      });
    });

    this.barChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'Amount ($)',
          },
          beginAtZero: true,
        },
      },
    };
  }

}
