export interface Order {
  customerName: string,
  lastContact?: string,
  orderDate: Date,
  status: OrderStatus
}

export enum OrderStatus {
  ORDER_PLACED = 'Order Placed',
  FORMS_SUBMITTED = 'Forms Submitted',
  TREE_IN_PROGRESS = 'Tree in Progress',
  TREE_COMPLETE = 'Tree Complete',
  SHIPPED = 'Shipped',
  COMPLETE = 'Complete'
}