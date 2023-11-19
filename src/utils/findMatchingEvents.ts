import { EventQueue, EventQueueItem, OrderMatch } from "../types";

export const findMatchingEvents = (
  orderIds: string[],
  events: EventQueue
): Map<string, OrderMatch> => {
  const orderIdMap = new Map<string, EventQueueItem>();
  const orderIdSecondMap = new Map<string, EventQueueItem>();

  // Pre-process events into separate maps
  for (const e of events) {
    if (
      e.nativeQtyReleased !== "0" &&
      e.orderId !== "0" &&
      e.nativeQtyPaid !== "0"
    ) {
      if (!orderIdMap.has(e.orderId)) {
        orderIdMap.set(e.orderId, e);
      }
      if (!orderIdSecondMap.has(e.orderIdSecond) && e.orderIdSecond !== "0") {
        orderIdSecondMap.set(e.orderIdSecond, e);
      }
    }
  }

  const matchedEvents = new Map<string, OrderMatch>();
  for (const orderId of orderIds) {
    if (orderId === "0") continue;
    // console.log("matching events for ", orderId)
    const orderIdMatched = orderIdMap.get(orderId);
    // console.log("Found order id matching with event idx",orderIdMatched?.idx)
    if (!orderIdMatched) continue;

    let orderIdSecondMatched;

    if (orderIdMatched?.orderIdSecond === "0") {
      // console.log('hey could not find order id second ')
      orderIdSecondMatched = orderIdSecondMap.get(orderId);
    } else {
      // console.log("Found order id second")
      orderIdSecondMatched = orderIdMap.get(orderIdMatched?.orderIdSecond);
    }
    matchedEvents.set(orderId, {
      orderIdMatchedEvent: orderIdMatched,
      orderIdSecondMatchedEvent: orderIdSecondMatched,
    });
  }

  return matchedEvents;
};
