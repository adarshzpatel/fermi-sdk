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
  timestamp:string
};


// write an enum for event flags and also write a function to decode the event flags
// 0x1 : Fill is represented by the bit 0x1, which is the binary value 0000 0001.
// 0x2 : Out is represented by the bit 0x2, which is the binary value 0000 0010.
// 0x4 : Bid is represented by the bit 0x4, which is the binary value 0000 0100.
// 0x8 : Maker is represented by the bit 0x8, which is the binary value 0000 1000.
// 0x10 : ReleaseFunds is represented by the bit 0x10, which is the binary value 0001 0000.
// 0x20 : Finalise is represented by the bit 0x20, which is the binary value 0010 0000.
// 0x12 : Both bid & maker event flag 

// 0x13 : fill + bid + maker 

// Given this, let's decode the values:
// eventflags: 1 in binary is 0000 0001, which means only the Fill event flag is set.
// eventflags: 12 in binary is 0000 1100, which means both the Bid and Maker event flags are set.
// To summarize:
// eventflags: 1 corresponds to the Fill event flag.
// eventflags: 12 corresponds to both the Bid and Maker event flags.

// eventflags: 13 corresponds to the combination of the Fill, Bid, and Maker event flags.
enum EventFlags {
  Fill = 0x1,
  Out = 0x2,
  Bid = 0x4,
  Maker = 0x8,
  ReleaseFunds = 0x10,
  Finalise = 0x20,
  
}
