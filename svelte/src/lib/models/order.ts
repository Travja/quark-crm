export enum TreeType {
  ANCESTRY = 'ANCESTRY',
  DESCENDANT = 'DESCENDANT',
  ANCESTRY_ROOTS = 'ANCESTRY_ROOTS',
  DESCENDANT_ROOTS = 'DESCENDANT_ROOTS'
}

export enum AncestryType {
  COUPLE = 'COUPLE',
  INDIVIDUAL = 'INDIVIDUAL'
}

export enum RootType {
  TWO_GEN_ANCESTOR = 'TWO_GEN_ANCESTOR',
  THREE_GEN_ANCESTOR = 'THREE_GEN_ANCESTOR',
  TWO_GEN_DESCENDANT = 'TWO_GEN_DESCENDANT',
  THREE_GEN_DESCENDANT = 'THREE_GEN_DESCENDANT'
}

export enum BranchStyle {
  STYLE_1 = 'STYLE_1',
  STYLE_2 = 'STYLE_2'
}

export enum TreeStyle {
  CLASSIC = 'CLASSIC',
  CHALK = 'CHALK'
}

export enum TextLocation {
  CENTER = 'CENTER',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export enum PrintType {
  STANDARD = 'STANDARD',
  MOUNTED_AND_TEXTURED = 'MOUNTED_AND_TEXTURED',
  CANVAS = 'CANVAS',
  DIGITAL = 'DIGITAL'
}

export enum Texture {
  LINEN = 'LINEN',
  CANVAS = 'CANVAS'
}

export enum PrintSize {
  EIGHT_BY_TEN = 'EIGHT_BY_TEN',
  ELEVEN_BY_FOURTEEN = 'ELEVEN_BY_FOURTEEN',
  SIXTEEN_BY_TWENTY = 'SIXTEEN_BY_TWENTY',
  TWENTY_BY_TWENTY_FOUR = 'TWENTY_BY_TWENTY_FOUR',
  TWENTY_FOUR_BY_THIRTY = 'TWENTY_FOUR_BY_THIRTY'
}

export enum Shipping {
  STANDARD = 'STANDARD',
  TWO_DAY = 'TWO_DAY',
  ONE_DAY = 'ONE_DAY'
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

export interface Order {
  id: string;
  customerName: string,
  customerEmail: string,
  customerAddress: string;
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
  shipping?: Shipping;
  additionalPrints?: AdditionalPrint[];
  cost: number;
  expenses: number;
  customDescription?: string;
  customCharge?: number;
  customExpenseDescription?: string;
  customExpense?: number;
  fees?: number;
  tax?: number;
  coupon?: Coupon;
}

export enum OrderStatus {
  ORDER_PLACED = 'Order Placed',
  FORMS_SUBMITTED = 'Forms Submitted',
  TREE_IN_PROGRESS = 'Tree in Progress',
  TREE_COMPLETE = 'Tree Complete',
  SHIPPED = 'Shipped',
  COMPLETE = 'Complete'
}