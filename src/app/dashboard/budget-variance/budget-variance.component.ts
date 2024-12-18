import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { BudgetsService } from '../../services/budgets.service';

@Component({
  selector: 'app-budget-variance',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './budget-variance.component.html',
  styleUrl: './budget-variance.component.css'
})
export class BudgetVarianceComponent implements OnInit {
  chartData: any;
  chartOptions: any;

  constructor(private budgetService: BudgetsService) {}

  ngOnInit() {
    this.loadBudgetData();
  }

  loadBudgetData() {
    this.budgetService.getBudgets().subscribe(budgets => {
      this.chartData = {
        labels: budgets.map(budget => budget.title || 'Uncategorized'),
        datasets: [
          {
            label: 'Budget Limit',
            backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#26C6DA', '#7E57C2', '#FF7043', '#78909C'],
            data: budgets.map(budget => budget.amount)
          }
        ]
      };

      this.chartOptions = {
        plugins: {
          legend: {
            labels: {
              color: '#495057'
            }
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                return `Budget: ${new Intl.NumberFormat('EGP', {
                  style: 'currency',
                  currency: 'EGP'
                }).format(context.raw)}`;
              }
            }
          }
        },
        responsive: true,
        scales: {
          x: {
            ticks: {
              color: '#495057'
            },
            grid: {
              color: '#ebedef'
            }
          },
          y: {
            ticks: {
              color: '#495057',
              callback: (value: number) => {
                return new Intl.NumberFormat('EGP', {
                  style: 'currency',
                  currency: 'EGP'
                }).format(value);
              }
            },
            grid: {
              color: '#ebedef'
            }
          }
        }
      };
    });
  }

}
