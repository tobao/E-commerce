import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg' 
const AddProduct = () => {

  const [image,setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price:"",
    old_price:""
  })

  const imageHander = (e) =>{
    setImage(e.target.files[0]);
  }

/* Note:
e.target.files[0]: Lấy tệp đầu tiên từ mảng các tệp được chọn (trong trường hợp này chỉ có một tệp).
setImage(e.target.files[0]): Cập nhật state image với tệp đã chọn. Điều này giúp bạn lưu trữ tệp hình ảnh trong state của component để sử dụng sau này, ví dụ như để hiển thị hình ảnh đã chọn hoặc để tải tệp lên máy chủ.
*/

  const changeHandler = (e) => {
    setProductDetails({...productDetails,[e.target.name]:e.target.value})
  }

  const Add_Product = async()=>{
    console.log(productDetails);
    let responseData;

    let product = productDetails;
    let formData = new FormData();
    formData.append('product',image);

    await fetch('http://localhost:4000/upload',{
      method:'POST',
      headers:{
        Accept:'application/json'
      },
      body:formData,
    }).then((resp) => resp.json()).then((data)=>{responseData=data});

    if(responseData.success){
      product.image = responseData.image_url;
      console.log(product);
      await fetch('http://localhost:4000/addproduct',{
        method:'POST',
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json'
        },
        body:JSON.stringify(product),
      }).then((resp)=> resp.json()).then((data)=>{
        data.success?alert("Product Added"):alert("Failed")
      })
    }
    
  }
/*Note:
Phân tích:

1.Khởi tạo các biến:
  let responseData;: Biến này sẽ lưu trữ dữ liệu phản hồi từ server.
  let product = productDetails;: Sao chép đối tượng productDetails vào product.
  let formData = new FormData();: Tạo một đối tượng FormData mới để chứa dữ liệu cần gửi lên server.

2.Thêm dữ liệu vào FormData:
  formData.append('product', image);: Thêm tệp hình ảnh vào FormData với key là 'product'.

3.Gửi yêu cầu fetch đến server:
  await fetch('http://localhost:4000/upload', { ... }): Gửi yêu cầu POST đến URL 'http://localhost:4000/upload'.
  Headers: Chỉ định rằng phản hồi mong muốn là JSON.
  Body: Gửi đối tượng formData chứa tệp hình ảnh.

4.Xử lý phản hồi từ server:
  .then((resp) => resp.json()): Chuyển đổi phản hồi thành JSON.
  .then((data) => { responseData = data });: Lưu dữ liệu phản hồi vào biến responseData.

5.Kiểm tra và cập nhật sản phẩm:
if (responseData.success) { ... }: Nếu phản hồi chỉ ra thành công, cập nhật đối tượng product với URL của hình ảnh

6.Gửi yêu cầu POST để thêm sản phẩm:
  await fetch('http://localhost:4000/addproduct', {...}): Gửi yêu cầu POST đến URL http://localhost:4000/addproduct với các thiết lập sau:
  Method: POST.
  Headers:
    Accept: 'application/json': Chấp nhận phản hồi JSON.
    Content-Type: 'application/json': Nội dung gửi đi là JSON.
  Body: Chuyển đổi đối tượng product thành chuỗi JSON bằng JSON.stringify(product).
7.Xử lý phản hồi:
  resp.json(): Chuyển đổi phản hồi thành JSON.
  data.success ? alert("Product Added") : alert("Failed"): Kiểm tra thuộc tính success trong phản hồi và hiển thị thông báo tương ứng.

Ở await fetch... ta có thể sử dụng try catch để bắt lỗi
 try {
    const addProductResponse = await fetch....
      ......
      body: JSON.stringify(product),
    });  
    if (!addProductResponse.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await addProductResponse.json();
    data.success ? alert("Product Added") : alert("Failed");
  } 
  catch (error) {
    console.error('There was a problem with the add product operation:', error);
    alert("Failed to add product");
  }
*/


  return (
    <div className='add-product'>
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name="name" placeholder='Type here' />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder='Type here' />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input value={productDetails.new_price}  onChange={changeHandler} type="text" name="new_price" placeholder='Type here' />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category:</p>
        <select value={productDetails.categoty} onChange={changeHandler} name="category" className='add-product-selector'>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img src={image?URL.createObjectURL(image):upload_area}  className='addproduct-thumnail-img' alt="" />
        </label>
        <input onChange={imageHander} type="file" name='image' id='file-input' hidden/>
      </div>
      <button onClick={()=>{Add_Product()}} className='addproduct-btn'>Add</button>
    </div>
  )
}

export default AddProduct

/* Note
Phân tích image ? URL.createObjectURL(image) : upload_area
==>Câu lệnh này sử dụng toán tử điều kiện (? :), thường được gọi là toán tử ba ngôi (ternary operator), để quyết định giá trị sẽ được sử dụng dựa trên trạng thái của image.
  image: Kiểm tra xem state image có giá trị hay không. Nếu image có giá trị (tức là người dùng đã chọn một tệp), điều kiện sẽ đúng.
  URL.createObjectURL(image): Nếu image có giá trị, tạo một URL tạm thời trỏ đến tệp đã chọn. URL.createObjectURL() là một phương thức của API URL, cho phép bạn tạo URL đại diện cho tệp hoặc đối tượng blob được chọn. URL này có thể được sử dụng để hiển thị tệp trong trình duyệt, ví dụ như trong thẻ <img>.
  upload_area: Nếu image không có giá trị (tức là chưa có tệp nào được chọn), sử dụng giá trị mặc định upload_area. upload_area có thể là một hình ảnh hoặc biểu tượng mặc định hiển thị khi chưa có tệp nào được chọn.
-----------------------------
Phân tích setProductDetails({ ...productDetails, [e.target.name]: e.target.value })
==>Khi bạn quản lý form trong React, bạn cần đảm bảo rằng trạng thái của các trường nhập liệu (input) được đồng bộ với state của component. Điều này thường được gọi là "controlled components". Dưới đây là phân tích chi tiết về cách thức hoạt động của đoạn mã này:

1. Sử dụng useState để quản lý state của form
  productDetails: Một đối tượng chứa các chi tiết của sản phẩm, bao gồm tên, hình ảnh, danh mục, giá mới và giá cũ.
  setProductDetails: Hàm dùng để cập nhật state productDetails.

2. Cập nhật state khi thay đổi giá trị trong form
  changeHandler: Hàm xử lý khi có sự thay đổi giá trị của các trường nhập liệu.
  ...productDetails: Toán tử spread (...) được sử dụng để sao chép tất cả các thuộc tính hiện có của đối tượng productDetails vào một đối tượng mới.
  [e.target.name]: e.target.value: Thiết lập giá trị của thuộc tính cụ thể được thay đổi trong đối tượng productDetails. e.target.name lấy tên của trường nhập liệu (name, new_price, old_price, category) và e.target.value lấy giá trị mới của trường nhập liệu đó.

  3.Gán giá trị cho các trường nhập liệu
  Mỗi trường nhập liệu cần được liên kết với state productDetails để đảm bảo rằng chúng là "controlled components". Điều này đảm bảo rằng giá trị của các trường nhập liệu luôn được cập nhật từ state và ngược lại.
  Ví dụ:
  Trường nhập tên sản phẩm:  
  <p>Product Title</p>
  <input  value={productDetails.name} onChange={changeHandler} ...>...
-------------------------------------------
Sử dụng arrow function trong sự kiện onClick của React có một số lợi ích
1. Tránh gọi hàm ngay lập tức
  Khi bạn viết onClick={Add_Product}, React sẽ gọi hàm Add_Product ngay lập tức khi component được render, thay vì khi người dùng nhấp vào nút. Điều này xảy ra vì bạn đang truyền kết quả của hàm Add_Product thay vì truyền hàm đó như một callback.
    ==>Không đúng: Gọi hàm ngay lập tức - <button onClick={Add_Product}>Add</button>
    ==> Đúng: Truyền hàm dưới dạng callback - <button onClick={() => Add_Product()}>Add</button>

2. Truyền tham số cho hàm
  Nếu bạn cần truyền tham số cho hàm Add_Product, bạn cần sử dụng một arrow function để truyền tham số đó.     
    Ví dụ: <button onClick={() => Add_Product(productId)}>Add</button>
  Trong trường hợp này, Add_Product được gọi với tham số productId khi người dùng nhấp vào nút.
3. Giữ ngữ cảnh this
  Sử dụng arrow function giúp giữ ngữ cảnh this của component hiện tại. Điều này quan trọng khi bạn gọi các hàm là method của class component hoặc khi bạn cần truy cập state và props trong function component.
    Ví dụ trong class component
    class MyComponent extends React.Component {
      handleClick = () => {
      console.log(this);
    }

    render() {
      return (
        <button onClick={this.handleClick}>Click me</button>
      );
    }
  Trong ví dụ này, this trong handleClick sẽ tham chiếu đến instance của MyComponent.
4. Sử dụng một hàm ẩn danh (anonymous function)
  Khi bạn sử dụng arrow function, bạn đang tạo ra một hàm ẩn danh mà không cần định nghĩa hàm đó bên ngoài component. Điều này làm cho code của bạn dễ đọc hơn và tránh việc tạo ra nhiều hàm bên ngoài không cần thiết.  
    Ví dụ cụ thể trong mã của bạn
    const Add_Product = async () => {
      console.log(productDetails);
    }

    <button onClick={() => Add_Product()} className='addproduct-btn'>Add</button>
  Phân tích:
    Arrow Function: () => Add_Product()
    Tạo một hàm ẩn danh (anonymous function) mà không gọi Add_Product ngay lập tức.
    Khi người dùng nhấp vào nút, hàm ẩn danh sẽ được gọi, và hàm ẩn danh này sẽ gọi Add_Product.
*/