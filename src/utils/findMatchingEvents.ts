import {type Event,type OrderMatch} from "../types"

export const findMatchingEvents = (orderIds: string[], events: Event[]):Map<string, OrderMatch> => {
  const orderIdMap = new Map<string, Event>();
  const orderIdSecondMap = new Map<string, Event>();

  // Pre-process events into separate maps
  for (const e of events) {
    if (e.nativeQtyReleased !== '0') {
      if (!orderIdMap.has(e.orderId)) {
        orderIdMap.set(e.orderId, e);
      }
      if (!orderIdSecondMap.has(e.orderIdSecond)) {
        orderIdSecondMap.set(e.orderIdSecond, e);
      }
    }
  }

  const matchedEvents = new Map<string, OrderMatch>();
  for (const orderId of orderIds) {
    if (orderId === '0') continue;

    const orderIdMatched = orderIdMap.get(orderId);
    const orderIdSecondMatched = orderIdSecondMap.get(orderId);

    if (orderIdMatched && orderIdSecondMatched) {
      // console.log(`Found a match for ${orderId} = ${orderIdMatched.idx} : ${orderIdSecondMatched.idx}`);

      matchedEvents.set(orderId, { orderIdMatched, orderIdSecondMatched });
    }
  }

  return matchedEvents
};





