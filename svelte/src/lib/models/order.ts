export enum TreeType {
  ANCESTRY = 'Ancestry',
  DESCENDANT = 'Descendant',
  ANCESTRY_ROOTS = 'Ancestry Roots',
  DESCENDANT_ROOTS = 'Descendant Roots'
}

export enum AncestryType {
  COUPLE = 'Couple',
  INDIVIDUAL = 'Individual'
}

export enum RootType {
  TWO_GEN_ANCESTOR = '2 Generation A',
  THREE_GEN_ANCESTOR = '3 Generation A',
  TWO_GEN_DESCENDANT = '2 Generation D',
  THREE_GEN_DESCENDANT = '3 Generation D'
}

export enum BranchStyle {
  STYLE_1 = 'Style 1',
  STYLE_2 = 'Style 2'
}

export enum TreeStyle {
  CLASSIC = 'Classic',
  CHALK = 'Chalk'
}

export enum TextLocation {
  CENTER = 'Center',
  LEFT = 'Left',
  RIGHT = 'Right'
}

export enum PrintType {
  STANDARD = 'Standard',
  MOUNTED_AND_TEXTURED = 'Mounted & Textured',
  CANVAS = 'Canvas',
  DIGITAL = 'Digital'
}

export enum Texture {
  LINEN = 'Linen',
  CANVAS = 'Canvas'
}

export enum PrintSize {
  EIGHT_BY_TEN = '8x10',
  ELEVEN_BY_FOURTEEN = '11x14',
  SIXTEEN_BY_TWENTY = '16x20',
  TWENTY_BY_TWENTY_FOUR = '20x24',
  TWENTY_FOUR_BY_THIRTY = '24x30'
}

export enum ShippingType {
  STANDARD = 'Standard',
  TWO_DAY = '2-Day',
  ONE_DAY = '1-Day',
  NONE = 'None'
}

export enum OrderStatus {
  ORDER_PLACED = 'Order Placed',
  FORMS_SUBMITTED = 'Forms Submitted',
  TREE_IN_PROGRESS = 'Tree in Progress',
  TREE_COMPLETE = 'Tree Complete',
  SHIPPED = 'Shipped',
  COMPLETE = 'Complete'
}

export interface AdditionalPrint {
  printType: PrintType;
  printSize: PrintSize;
  quantity: number;
}

export interface Coupon {
  id: string;
  code: string;
  target: string;
  expiry: Date;
  value: number;
  coupon: boolean;
  manual: boolean;
}

export interface Customer {
  customerName: string,
  customerEmail: string,
  customerAddress: string;
}

export interface Order {
  id: string;
  customer: Customer;
  artist: string;
  status: OrderStatus;
  created: Date;
  requestDate?: Date;
  branchesAmount?: string,
  background: string,
  fontColor: string,
  familyName?: string,
  established?: string,
  familyFont?: string,
  quote?: string,
  quoteFont?: string,
  groundText?: string,
  groundFont?: string,
  frame?: string,
  comments?: string,
  type: TreeType;
  ancestryType?: AncestryType;
  generations: number;
  roots?: RootType;
  hasDateBranches?: boolean,
  hasLeaves: boolean,
  hasDoubleTrunk: boolean;
  branchStyle: BranchStyle;
  treeStyle: TreeStyle;
  nameLocation?: TextLocation,
  quoteLocation?: TextLocation;
  printType: PrintType;
  texture?: Texture;
  printSize?: PrintSize;
  printCost?: number;
  shippingType: ShippingType;
  shippingCost: number;
  additionalPrints?: AdditionalPrint[];
  cost: number;
  dateBranchCost: number;
  leafCost: number;
  rootCost: number;

  vendor?: string;
  notes?: string;
  updates: number;
  updateCost: number;
  expenses: number;
  customDescription?: string;
  customCharge: number;
  customExpenseDescription?: string;
  customExpense: number;
  shippingExpense: number;
  fees: number;
  tax: number;
  printExpense: number;
  coupon?: Coupon;
}