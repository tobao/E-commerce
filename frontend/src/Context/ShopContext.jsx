// import React, { createContext } from "react";
import { React, createContext, useState } from "react";
import all_product from '../Components/Assets/all_product'
import CartItems from "../Components/CartItems/CartItems";

export const ShopContext = createContext(null);

const getDefaultCart = () =>{
  let cart = {};
  for (let index=0; index<all_product.length;index++){
    cart[index] = 0;
  }
  return cart;
}

 const ShopContextProvider = (props) => {
 

   const [cartItems,setCartItems] = useState(getDefaultCart());
  
  const addToCart = (itemId) =>{
     setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));
  }

  const removeFromCart = (itemId) =>{
    setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
  }

  const getTotalCartAmount = () => {
    let totalAmount = 0;

    //Cách 1: ko hiệu quả ko áp dụng  
    // for(const item in cartItems)
    //   {
    //     if(cartItems[item]>0)
    //       {
    //         console.log(cartItems);
    //         let itemInfo = all_product.find((product)=> product.id ===Number(item));
    //         totalAmount += itemInfo.new_price * cartItems[item];
    //       }
    //       return totalAmount;
    //   }

    //Cách 2:
    // for (const [item, quantity] of Object.entries(cartItems)) {
    //   if (quantity > 0) {
    //     console.log(cartItems);
    //     let itemInfo = all_product.find((product) => product.id === Number(item));
    //     if (itemInfo) {
    //       totalAmount += itemInfo.new_price * quantity;
    //     }
    //   }
    // }
  
    // return totalAmount;

    //Cách 3:
    Object.keys(cartItems).forEach((item) => {
      if (cartItems[item] > 0) {
        console.log(cartItems);
        let itemInfo = all_product.find((product) => product.id === Number(item));
        if (itemInfo) {
          totalAmount += itemInfo.new_price * cartItems[item];
        }
      }
    });
    return totalAmount;

    
  }

  const getTotalCartItems = () =>{
    let totalItem = 0;
    for (const [item, quantity] of Object.entries(cartItems)) {
      if (quantity > 0) {
        totalItem += quantity;
      }
    }
  
    return totalItem;
  }
 
  const contextValue = {getTotalCartItems, getTotalCartAmount, all_product, cartItems, addToCart, removeFromCart };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  )
}


// const ShopContextProvider = ({ children }) => {
  
//   const contextValue = {all_product};
//   return (
//     <ShopContext.Provider value={contextValue}>
//       {children}
//     </ShopContext.Provider>
//   );
// }

export default ShopContextProvider;