import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import cross_icon from '../../assets/cross_icon.png'
const ListProduct = () => {

  const [allproducts,setAllproducts] = useState([]);
  //Khởi tạo với một mảng rỗng để lưu trữ danh sách các sản phẩm.

  const fetchInfor = async () =>{
    await fetch('http://localhost:4000/allproducts')
    .then((res)=>res.json())
    .then((data)=>{setAllproducts(data)})
  } 
/* Note
  fetchInfor:
    Gửi yêu cầu GET đến http://localhost:4000/allproducts.
    Chuyển đổi phản hồi thành JSON và cập nhật state allproducts với dữ liệu nhận được.
  Code cải thiện:
   const fetchInfor = async () => {
    try {
      const response = await fetch('http://localhost:4000/allproducts');
      const data = await response.json();
      setAllproducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

*/

  useEffect(()=>{
    fetchInfor();
  },[])
/*Note
  useEffect:
    Được gọi một lần khi component được mount.
    Gọi hàm fetchInfor để tải danh sách sản phẩm từ server khi component được render lần đầu tiên.
 */
 const remove_product = async(id) => {
  await fetch('http://localhost:4000/removeproduct',{
    method:'POST',
    headers:{
      Accept:'application/json', // Client mong muốn nhận phản hồi ở định dạng JSON
      'Content-Type':'application/json' //Dữ liệu gửi đi là JSON
    },
    body:JSON.stringify({id:id})
  })
  await fetchInfor();
 }
/*Note
remove_product:
  Gửi yêu cầu POST đến http://localhost:4000/removeproduct với ID của sản phẩm cần xóa.
  Sau khi xóa sản phẩm, gọi lại fetchInfor để cập nhật danh sách sản phẩm.
  Trong đó
    Accept: 'application/json': Giúp client nhận dữ liệu JSON từ server.
    Content-Type: 'application/json': Giúp server hiểu rằng dữ liệu mà client gửi tới là JSON 
  Định nghĩa 
    (*)Accept: 'application/json':
      Ý nghĩa: Đây là một HTTP header được client (trong trường hợp này là trình duyệt hoặc ứng dụng React của bạn) gửi tới server để chỉ định rằng client mong muốn nhận phản hồi ở định dạng JSON.
      Công dụng: Header này giúp server biết được định dạng dữ liệu mà client mong muốn nhận về. Nếu server có thể đáp ứng, nó sẽ gửi dữ liệu ở định dạng đó.
    
    (*)Content-Type: 'application/json':
      Ý nghĩa: Đây là một HTTP header được client gửi tới server để chỉ định rằng dữ liệu mà client đang gửi tới server là ở định dạng JSON.
      Công dụng: Header này giúp server biết cách xử lý dữ liệu mà client gửi tới. Nếu không có header này, server có thể không hiểu rằng dữ liệu gửi tới là JSON và không thể xử lý đúng cách.
  Nếu thiếu các headers này:
    Không có Accept: 'application/json':Nếu server trả về dữ liệu ở định dạng JSON nhưng client không chỉ định Accept: 'application/json', server vẫn có thể trả về dữ liệu JSON nhưng client không chắc chắn được rằng dữ liệu sẽ ở định dạng JSON.
    Không có Content-Type: 'application/json':Nếu không có header này, server có thể không hiểu rằng dữ liệu gửi tới là JSON và không thể xử lý đúng cách. Ví dụ, server có thể nghĩ rằng dữ liệu là plain text hoặc một định dạng khác, dẫn tới lỗi hoặc hành vi không mong muốn.
-------------------
Code cải thiện:
  const remove_product = async (id) => {
    try {
      await fetch('http://localhost:4000/removeproduct', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
      });
      await fetchInfor();
    } catch (error) {
      console.error('Error removing product:', error);
  }
*/
  return (
    <div className='list-product'>
      <h1>All Product List</h1>
      <div className="listproduct-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product,index)=>{
          /* Note
          Có thể cải thiện bằng cách sử dụng React.Fragment: Để tránh cảnh báo và đảm bảo mã nguồn hợp lệ, bọc các phần tử lặp trong React.Fragment với thuộc tính key.
          {allproducts.map((product, index) => (
            <React.Fragment key={index}>
              <div className="listproduct-format-main listproduct-format">
              .....
            </React.Fragment>
          ))}
           */
          return <> <div key={index} className="listproduct-format-main listproduct-format">
            <img src={product.image} alt="" className="listproduct-product-icon" />
            <p>{product.name}</p>
            <p>${product.old_price}</p>
            <p>${product.new_price}</p>
            <p>{product.category}</p>
            <img onClick={()=>{remove_product(product.id)}} className="listproduct-remove-icon" 
            src={cross_icon} alt="" />
          </div> 
          <hr />
          </>
        })}
      </div>
    </div>
  )
}

export default ListProduct