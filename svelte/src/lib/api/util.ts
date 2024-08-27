// @ts-ignore
import type { Order } from '@types/global';

const dateFormat = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium'
});

export const formatDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  return dateFormat.format(date);
};

export const formatCurrency = (value: number): string => {
  if (Number.isInteger(value)) {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  } else {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }
};

export const totalOperatingCosts = (order: Order): number => {
  return sumOperatingCosts(order) - sumExpenses(order);
};

export const sumOperatingCosts = (order: Order): number => {
  const value =
    order.creationCost +
    order.rootCost +
    order.dateBranchCost +
    order.leafCost +
    order.printCost +
    order.frameCost +
    order.additionalPrints
      .map((p) => p.cost + p.frameCost)
      .reduce((a, b) => a + b, 0) +
    order.shippingCost +
    order.customCharge;
  return value;
};

export const sumExpenses = (order: Order): number => {
  const value =
    order.printExpense +
    order.frameExpense +
    order.shippingExpense +
    order.tax +
    order.customExpense;
  return value;
};
