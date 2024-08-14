import {
  AncestryType,
  BranchStyle,
  CustomerType,
  FontColor,
  OrderStatus,
  PrintSize,
  PrintType,
  RootType,
  ShippingType,
  TextLocation,
  Texture,
  TreeStatus,
  TreeStyle,
  TreeType
} from '$lib/models/order';

interface IFileSystemAPI {
  send(arg0: string, arg1): void;

  receive(arg0: string, func: (arg0) => void): void;
}

interface IElectronAPI {
  saveFile: () => void;
  readFile: () => void;
}

interface IElectronWindowSystem {
  close: () => void;
  minimize: () => void;
  maximize: () => void;
  showDevTools: () => void;
  login: (data: any) => any;
  onFocus: (callback: (event: any, value: any) => void) => void;
  onBlur: (callback: (event: any, value: any) => void) => void;
  isFocused: () => Promise<boolean>;
  isDarkTheme: () => boolean;
  move: (x: number, y: number) => void;
  writeCredentials: (data: { token: string; refreshToken: string }) => void;
}

export declare interface ApiWindow extends Window {
  api: IElectronAPI;
  electron: IElectronWindowSystem;
}

export interface AdditionalPrint {
  printType: PrintType;
  printSize: PrintSize;
  frame?: string;
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
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerType: CustomerType;
}

export interface Order {
  id: string;
  customer: Customer;
  artist: 'Karen' | 'MaKaela';
  status: OrderStatus;
  treeStatus: TreeStatus;

  created: Date;
  requestDate?: Date | string;

  branchesAmount?: string;

  background: string;
  fontColor: FontColor;

  familyName?: string;
  established?: string;
  familyFont?: string;
  nameLocation?: TextLocation;

  quote?: string;
  quoteFont?: string;
  quoteLocation?: TextLocation;

  groundText?: string;
  groundFont?: string;

  frame?: string;
  comments?: string;
  type: TreeType;
  ancestryType?: AncestryType;
  generations: number;
  roots?: RootType;
  hasDateBranches?: boolean;
  hasLeaves: boolean;
  hasDoubleTrunk: boolean;
  branchStyle: BranchStyle;
  treeStyle: TreeStyle;
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

  lastContact?: string;
}
