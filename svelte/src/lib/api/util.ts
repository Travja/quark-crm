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
