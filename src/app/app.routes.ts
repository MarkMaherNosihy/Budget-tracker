import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IncomeComponent } from './income/income/income.component';
import { UpsertIncomeComponent } from './income/upsert-income/upsert-income.component';
import { ExpenseComponent } from './expenses/expense/expense.component';
import { UpsertExpenseComponent } from './expenses/upsert-expense/upsert-expense.component';
import { GoalsComponent } from './goals/goals/goals.component';
import { UpsertGoalsComponent } from './goals/upsert-goals/upsert-goals.component';
import { BudgetComponent } from './budgets/budget/budget.component';
import { BudgetUpsertComponent } from './budgets/budget-upsert/budget-upsert.component';

export const routes: Routes = [

    {component:LoginComponent, path:'login'},
    {component:RegisterComponent, path:'register'},
    {component:DashboardComponent, path:'dashboard'},
    {component:IncomeComponent, path:'income'},

    {component:ExpenseComponent, path:'expenses'},
    {component:GoalsComponent, path:'goals'},

    {component:UpsertIncomeComponent, path:'income/create'},
    {component:UpsertIncomeComponent, path:'income/edit/:id'},
    {component:UpsertExpenseComponent, path:'expenses/create'},
    {component:UpsertExpenseComponent, path:'expenses/edit/:id'},
    {component:UpsertGoalsComponent, path:'goals/create'},
    {component:UpsertGoalsComponent, path:'goals/edit/:id'},
    {component:BudgetComponent, path:'budgets'},
    {component:BudgetUpsertComponent, path:'budgets/create'},
    {component:BudgetUpsertComponent, path:'budgets/edit/:id'},
];
