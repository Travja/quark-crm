import { OrderStatus, TreeStatus } from '$lib/models/order';

export const getOrderStatusColor = (orderStatus: OrderStatus) => {
  switch (orderStatus) {
    case OrderStatus.ORDER_PLACED:
      return 'rgba(85,177,73,0.5)';
    case OrderStatus.UNPAID:
      return 'rgba(178,2,23,0.5)';
    case OrderStatus.INVOICED:
      return 'rgba(255,136,136,0.5)';
    case OrderStatus.PAID:
      return 'rgba(85,177,73,0.5)';
    case OrderStatus.PRINT_ORDERED:
      return 'rgba(0,255,255,0.5)';
    case OrderStatus.QUESTION_ASKED:
      return 'rgba(154,249,226,0.5)';
    case OrderStatus.QUESTION_ANSWERED:
      return 'rgba(77,207,172,0.5)';
    case OrderStatus.TRACKING_SENT:
      return 'rgba(255,102,0,0.5)';
    case OrderStatus.PROBABLY_NOT_ORDERING:
      return 'gray';
    case OrderStatus.ON_HOLD:
      return '#555';
    case OrderStatus.CANCELLED:
      return '#000000';
    default:
      return undefined;
  }
};

export const getOrderStatusForegroundColor = (orderStatus: OrderStatus) => {
  switch (orderStatus) {
    case OrderStatus.UNPAID:
    case OrderStatus.ON_HOLD:
    case OrderStatus.CANCELLED:
      return 'white';
    default:
      return 'black';
  }
};

export const getTreeStatusColor = (treeStatus: TreeStatus) => {
  switch (treeStatus) {
    case TreeStatus.ASSIGNED:
      return 'rgba(0,255,255,0.5)';
    case TreeStatus.WAITING_FOR_NAMES:
      return 'rgba(255,255,0,0.5)';
    case TreeStatus.CREATING:
      return 'rgba(77,207,172,0.5)';
    case TreeStatus.WAITING_FOR_QUESTION:
      return 'rgba(255,136,136,0.5)';
    case TreeStatus.PROOF_SUBMITTED:
      return 'rgba(255,102,0,0.5)';
    case TreeStatus.PROOF_FOLLOW_UP:
      return 'rgba(255,102,0,0.5)';
    case TreeStatus.ADJUSTING:
      return 'rgba(144,86,206,0.5)';
    case TreeStatus.RESUBMITTED:
      return 'rgba(255,102,0,0.5)';
    case TreeStatus.APPROVED:
      return 'rgba(85,177,73,0.5)';
    default:
      return undefined;
  }
};

export const getTreeStatusForegroundColor = (treeStatus: TreeStatus) => {
  return 'black';
};
