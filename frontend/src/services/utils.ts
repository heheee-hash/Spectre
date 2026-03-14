// Simulates network delay for realistic demo experience
export const simulateDelay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

let counter = 1000;
export const generateId = (prefix: string) => `${prefix}-${String(++counter).padStart(3, '0')}`;

export const generateReference = (prefix: string) => {
  const year = new Date().getFullYear();
  const seq = String(++counter).padStart(3, '0');
  return `${prefix}/${year}/${seq}`;
};

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

export const formatNumber = (num: number) =>
  new Intl.NumberFormat('en-US').format(num);
