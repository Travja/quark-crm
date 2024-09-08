// @ts-ignore
import type { Order } from '@types/global';
import { get } from 'svelte/store';
import { artists } from '$lib/data';

const dateFormat = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium'
});

export const formatDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  return dateFormat.format(date);
};

export const formatCurrency = (value?: number): string => {
  if (value === undefined || value === null) return undefined;

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

export const sanitizeOrder = (order?: Order): void => {
  if (!order) return;

  if (order.created) order.created = new Date(order.created);
  if (order.requestDate) order.requestDate = new Date(order.requestDate);

  if (order.artist) {
    order.artist = get(artists).find((a) => a.id === order.artist.id);
  }
};

export const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (!a && !b) return true;
  if ((!a && b) || (a && !b)) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;

    return a.every((val, i) => deepEqual(val, b[i]));
  }

  if (typeof a !== 'object' || typeof b !== 'object') return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (let ka of keysA) {
    if (!keysB.includes(ka)) return false;
    if (!deepEqual(a[ka], b[ka])) return false;
  }

  return true;
};
