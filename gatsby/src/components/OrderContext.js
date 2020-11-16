import React, { useState } from 'react';

// Create an order context
const OrderContext = React.createContext();

// create a provider -- component that lives at higher level
export function OrderProvider({ children }) {
  // we need to stick state in here
  const [order, setOrder] = useState([]);
  return (
    <OrderContext.Provider value={[order, setOrder]}>
      {children}
    </OrderContext.Provider>
  );
}

export default OrderContext;
