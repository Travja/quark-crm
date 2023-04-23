import { OrderStatus, TreeStatus } from '$lib/models/order';

export const getOrderStatusColor = (orderStatus: OrderStatus) => {
  switch (orderStatus) {
    case OrderStatus.ORDER_PLACED:
      return '#55b149';
    case OrderStatus.UNPAID:
      return '#b20217';
    case OrderStatus.INVOICED:
      return '#f88';
    case OrderStatus.PAID:
      return '#55b149';
    case OrderStatus.PRINT_ORDERED:
      return '#00ffff';
    case OrderStatus.QUESTION_ASKED:
      return '#9af9e2';
    case OrderStatus.QUESTION_ANSWERED:
      return '#4dcfac';
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
      return '#00ffff';
    case TreeStatus.WAITING_FOR_NAMES:
      return '#ffff00';
    case TreeStatus.CREATING:
      return '#4dcfac';
    case TreeStatus.WAITING_FOR_QUESTION:
      return '#f88';
    case TreeStatus.PROOF_SUBMITTED:
      return '#ff6600';
    case TreeStatus.PROOF_FOLLOW_UP:
      return '#ff6600';
    case TreeStatus.ADJUSTING:
      return '#9056ce';
    case TreeStatus.RESUBMITTED:
      return '#ff6600';
    case TreeStatus.APPROVED:
      return '#55b149';
    default:
      return undefined;
  }
};