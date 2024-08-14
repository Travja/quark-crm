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

export const getPrintTypeShortCode = (printType: PrintType) => {
  switch (printType) {
    case PrintType.STANDARD:
      return 'Std';
    case PrintType.MOUNTED_AND_TEXTURED:
      return 'M&T';
    case PrintType.CANVAS:
      return 'GWC';
    case PrintType.DIGITAL:
      return 'Dig';
  }
};

export enum Texture {
  LINEN = 'Linen',
  CANVAS = 'Canvas'
}

export enum PrintSize {
  EIGHT_BY_TEN = '8x10',
  ELEVEN_BY_FOURTEEN = '11x14',
  SIXTEEN_BY_TWENTY = '16x20',
  TWENTY_BY_TWENTY_FOUR = '20x24',
  TWENTY_FOUR_BY_THIRTY = '24x30',
  CUSTOM = 'Custom'
}

export enum ShippingType {
  STANDARD = 'Standard',
  TWO_DAY = '2-Day',
  ONE_DAY = '1-Day',
  NONE = 'None'
}

export enum OrderStatus {
  ORDER_PLACED = 'Order Placed',
  UNPAID = 'Unpaid',
  INVOICED = 'Invoiced',
  PAID = 'Paid',
  PRINT_ORDERED = 'Print Ordered',
  QUESTION_ASKED = 'Question Asked',
  QUESTION_ANSWERED = 'Question Answered',
  TRACKING_SENT = 'Tracking # Sent',
  PROBABLY_NOT_ORDERING = 'Probably Not Ordering',
  ON_HOLD = 'On Hold',
  CANCELLED = 'Cancelled'
}

export enum TreeStatus {
  ASSIGNED = 'Assigned',
  WAITING_FOR_NAMES = 'Waiting for Names',
  CREATING = 'Creating',
  WAITING_FOR_QUESTION = 'Waiting for answer to Question',
  PROOF_SUBMITTED = 'Proof Submitted',
  PROOF_FOLLOW_UP = 'Proof Follow Up',
  ADJUSTING = 'Adjusting',
  RESUBMITTED = 'Resubmitted',
  APPROVED = 'Approved'
}

export enum FontColor {
  BLACK = 'Black',
  WHITE = 'White',
  BROWN = 'Brown'
}

export enum CustomerType {
  NEW = 'NEW',
  RETURNING = 'RETURNING'
}
