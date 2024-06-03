import React, { useState } from 'react'
import './CSS/LoginSignup.css'
const LoginSignup = () => {

  const [state,setState] = useState("Login");

  const [formData,setFormData]= useState({
    username:"",
    password:"",
    email:""
  })
  /*
   Form đăng ký người dùng với các trường username, email và password. Sử dụng React hooks (useState) để quản lý trạng thái form và cập nhật trạng thái khi người dùng nhập liệu.
   useState: Khởi tạo state cho form với các giá trị ban đầu là chuỗi rỗng.
    formData: Trạng thái hiện tại của form, chứa các giá trị của các trường username, password, và email.
    setFormData: Hàm để cập nhật trạng thái formData
  */
  const changeHandler = (e)=>{
    setFormData({...formData,[e.target.name]:e.target.value});
  }
  /*
  changeHandler: Hàm được gọi khi có sự thay đổi trong các trường của form.
    e: Sự kiện thay đổi (event).
    setFormData({ ...formData, [e.target.name]: e.target.value }): Cập nhật trạng thái formData với giá trị mới từ trường form.
      ...formData: Sao chép tất cả các thuộc tính hiện tại của formData.
      [e.target.name]: Tên của trường form (ví dụ: username, email, password).
      e.target.value: Giá trị mới của trường form.
  */
  const login = async () =>{
    console.log("login",formData);
    let responseData;
    await fetch('http://localhost:4000/login',{
      method:'POST',
      headers:{
        Accept:'application/form-data', 
        'Content-Type':'application/json'
      },
      body: JSON.stringify(formData)
    }).then((response)=> response.json()).then((data)=>responseData=data)

    if(responseData.success){
      localStorage.setItem('auth-token',responseData.token);
      window.location.replace("/")
    }
    else{
      alert(responseData.error)
    }
  }

  const signup = async () =>{
    console.log("signup",formData);
    let responseData;
    await fetch('http://localhost:4000/signup',{
      method:'POST',
      headers:{
        Accept:'application/form-data', 
        'Content-Type':'application/json'
      },
      body: JSON.stringify(formData)
    }).then((response)=> response.json()).then((data)=>responseData=data)

    if(responseData.success){
      localStorage.setItem('auth-token',responseData.token);
      window.location.replace("/")
    }
    else{
      alert(responseData.errors)
    }
  }
/* Note
1.Định nghĩa hàm signup:
  const signup = async () => { ... }: Định nghĩa một hàm bất đồng bộ để xử lý đăng ký người dùng.

2.Ghi log dữ liệu form:
  console.log("signup", formData);: Ghi log dữ liệu form để kiểm tra.

3.Khởi tạo biến responseData:
  let responseData;: Khởi tạo một biến để lưu trữ phản hồi từ server.
4.Gửi yêu cầu POST tới endpoint /signup:
  await fetch('http://localhost:4000/signup', { ... }):
    - await: Đợi kết quả từ yêu cầu fetch.
    - fetch: Hàm để gửi yêu cầu HTTP.
    - 'http://localhost:4000/signup': URL của endpoint /signup.
    - method: 'POST': Phương thức HTTP là POST.
    - headers: Định nghĩa các header cho yêu cầu.
      + Accept: 'application/form-data': Định nghĩa loại dữ liệu mà client mong muốn nhận từ server (có vẻ không phù hợp ở đây).
      + 'Content-Type': 'application/json': Định nghĩa loại dữ liệu được gửi tới server là JSON.
    - body: JSON.stringify(formData): Chuyển đổi dữ liệu form thành chuỗi JSON và gửi trong body của yêu cầu.

5.Xử lý phản hồi từ server:

  .then((response) => response.json()): Chuyển đổi phản hồi từ server thành JSON.
  .then((data) => responseData = data): Gán dữ liệu phản hồi cho biến responseData.

6.Kiểm tra kết quả đăng ký:
  if (responseData.success): Kiểm tra nếu đăng ký thành công.
    localStorage.setItem('auth-token', responseData.token);: Lưu token xác thực vào localStorage.
    window.location.replace("/");: Chuyển hướng người dùng tới trang chủ.
  else: Nếu đăng ký thất bại.
    alert(responseData.errors);: Hiển thị thông báo lỗi.

Code cải thiện:
const signup = async () => {
  try {
    console.log("signup", formData);
    let responseData;
    const response = await fetch('http://localhost:4000/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    responseData = await response.json();

    if (responseData.success) {
      localStorage.setItem('auth-token', responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.errors);
    }
  } catch (error) {
    console.error('Error during signup:', error);
    alert('An error occurred during signup. Please try again.');
  }
};
*/

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state==="Sign up"?<input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name...'/>:<></>}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address...' />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password...' />
        </div>
        <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>
        {state==="Sign up"?<p className='loginsignup-login'>Already have an account? <span onClick={()=>{setState("Login")}}>Login here</span></p>
        :<p className='loginsignup-login'>Create an account? <span onClick={()=>{setState("Sign up")}}>Click here</span></p>}
      
        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continue, I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup