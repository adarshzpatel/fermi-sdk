export type Event = {
  idx: number;
  orderId: string;
  orderIdSecond: string;
  owner: string;
  eventFlags: number;
  ownerSlot: number;
  finalised: number;
  nativeQtyReleased: string;
  nativeQtyPaid: string;
};
