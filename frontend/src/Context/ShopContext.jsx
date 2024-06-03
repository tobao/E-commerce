// import React, { createContext } from "react";
import { React, createContext, useEffect, useState } from "react";
import all_product from '../Components/Assets/all_product'


export const ShopContext = createContext(null);

const getDefaultCart = () =>{
  let cart = {};
  for (let index=0; index<all_product.length;index++){
    cart[index] = 0;
  }
  // for (let index=0; index<300+1;index++){
  //   cart[index] = 0;
  // }
  return cart;
}

 const ShopContextProvider = (props) => {
 
  // const [all_product,setAll_Product]=useState([]);

  const [cartItems,setCartItems] = useState(getDefaultCart());

  // useEffect(()=>{
  //   fetch('http://localhost:4000/allproducts')
  //   .then((response)=>response.json())
  //   .then((data)=>setAll_Product(data))

  //   if(localStorage.getItem('auth-token')){
  //     fetch('http://localhost:4000/getcart',{
  //       method:"POST",
  //       headers:{
  //         Accept:'appliccation/form-data',
  //         'auth-token':`${localStorage.getItem('auth-token')}`,
  //         'Content-Type':'application/json'
  //       },
  //       body:"",  
  //     }).then((response)=> response.json())
  //     .then((data)=>setCartItems(data));
  //   }
  // },[])

  const addToCart = (itemId) =>{
     setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));
    //  if(localStorage.getItem('auth-token')){
    //   fetch('http://localhost:4000/addtocart',{
    //     method:'POST',
    //     headers:{
    //       Accept:'appliccation/form-data',
    //       'auth-token':`${localStorage.getItem('auth-token')}`,
    //       'Content-Type':'application/json'
    //     },
    //     body:JSON.stringify({"itemId":itemId})
    //   })
    //   .then((response)=> response.json())
    //   .then((data)=>console.log(data));
    //  }else{
    //    alert("Please log in to your account to ensure your cart.");
      
    //   return;
    // }
  }
/* Note
1.Hàm addToCart:
  addToCart là một hàm nhận tham số itemId, có chức năng thêm một sản phẩm vào giỏ hàng.

2.setCartItems là một hàm cập nhật trạng thái của giỏ hàng.
  prev là trạng thái trước đó của giỏ hàng.
  ...prev sao chép tất cả các phần tử hiện tại của giỏ hàng.
  [itemId]: prev[itemId] + 1 tăng số lượng của sản phẩm với itemId lên 1.

3.Kiểm tra sự tồn tại của token: if (localStorage.getItem('auth-token')) {}
  Kiểm tra xem token xác thực có tồn tại trong localStorage hay không.
  Token được lưu trong localStorage với key là 'auth-token'.

4.Thực hiện yêu cầu fetch: fetch('http://localhost:4000/addtocart', {....}
  Thực hiện yêu cầu HTTP POST đến URL http://localhost:4000/addtocart.
  method: 'POST' xác định phương thức HTTP là POST.
  headers chứa các thông tin về định dạng dữ liệu và token xác thực:
    Accept: 'application/form-data': Chấp nhận dữ liệu dạng form-data (có thể sửa thành 'application/json' để đồng nhất với Content-Type).
    'auth-token': ${localStorage.getItem('auth-token')}``: Đính kèm token xác thực từ localStorage.
    'Content-Type': 'application/json': Định dạng dữ liệu gửi đi là JSON.
  body: JSON.stringify({ "itemId": itemId }): Dữ liệu gửi đi là một đối tượng JSON chứa itemId.

  5.Xử lý phản hồi:
  .then((response) => response.json()): Chuyển đổi phản hồi thành định dạng JSON.
  .then((data) => console.log(data)): In ra dữ liệu phản hồi từ server.

COde cải thiện:
const addToCart = (itemId) => {
  setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  const authToken = localStorage.getItem('auth-token');
  if (authToken) {
    fetch('http://localhost:4000/addtocart', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'auth-token': authToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ itemId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => console.log(data))
      .catch((error) => console.error('There was a problem with the fetch operation:', error));
  }
};
*/
/* Note 2
localStorage là một phần của Web Storage API được cung cấp bởi trình duyệt web. Nó cho phép lưu trữ dữ liệu một cách đơn giản và bền vững (tồn tại ngay cả khi bạn đóng trình duyệt).
Bạn không cần phải khai báo localStorage trong mã của mình; nó có sẵn toàn cầu khi bạn làm việc với các ứng dụng web trong trình duyệt

1.Để Lấy dữ liệu:
  localStorage.getItem(key) được sử dụng để lấy dữ liệu đã lưu trữ.
  Nếu không có dữ liệu tương ứng với key, nó sẽ trả về null.
2.Lưu trữ dữ liệu:
  localStorage.setItem(key, value) được sử dụng để lưu trữ dữ liệu.
  Dữ liệu được lưu dưới dạng chuỗi (string).
3.Xóa dữ liệu:
  localStorage.removeItem(key) để xóa một mục cụ thể.
  localStorage.clear() để xóa tất cả dữ liệu trong localStorage.  
Lưu ý:
  localStorage chỉ khả dụng trên môi trường trình duyệt, không khả dụng trên server (Node.js).
  Dữ liệu lưu trữ trong localStorage là dữ liệu dạng chuỗi, bạn cần chuyển đổi (parse) khi lưu trữ các loại dữ liệu phức tạp hơn (như đối tượng JSON).

*/
  const removeFromCart = (itemId) =>{
    setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}));
    // if(localStorage.getItem('auth-token')){
    //   fetch('http://localhost:4000/removefromcart',{
    //     method:'POST',
    //     headers:{
    //       Accept:'appliccation/form-data',
    //       'auth-token':`${localStorage.getItem('auth-token')}`,
    //       'Content-Type':'application/json'
    //     },
    //     body:JSON.stringify({"itemId":itemId})
    //   })
    //   .then((response)=> response.json())
    //   .then((data)=>console.log(data));
    // }
  }

  const getTotalCartAmount = () => {
    let totalAmount = 0;

    //Cách 1:  
    // for(const item in cartItems)
    //   {
    //     if(cartItems[item]>0)
    //       {
    //         console.log(cartItems);
    //         let itemInfo = all_product.find((product)=> product.id ===Number(item));
    //         totalAmount += itemInfo.new_price * cartItems[item];
    //       }
    //
    //   }
    //  return totalAmount;
    
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
        // console.log(cartItems);
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