import React, { useContext, useRef, useState } from 'react'
import './Navbar.css'
// import logo from '../Assets/logo.png'
import logo1 from '../Assets/modified_logo-Photoroom (1).png'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'
import nav_menu from '../Assets/nav_menu.png'
const Navbar = () => {

  const [menu,setMenu] = useState("shop");
  const {getTotalCartItems} = useContext(ShopContext);
  const menuRef = useRef();

  const menu_toggle = (e) =>{
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');
  }

  return (
    <div className='navbar'>
      <div className='nav-logo'>
        {/* <img src={logo} alt=''/> */}
        <img src={logo1} alt=''/>
        <p>SHOPPER</p>
      </div>
      <img className='nav-dropdown' onClick={menu_toggle} src={nav_menu} alt="" />
      <ul ref={menuRef} className='nav-menu'>
        <li onClick={()=>{setMenu("shop")}}> <Link style={{textDecoration:'none'}} to='/'>SHOP </Link>{menu==="shop"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("mens")}}> <Link style={{textDecoration:'none'}} to='/mens'>MEN</Link> {menu==="mens"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("womens")}}> <Link style={{textDecoration:'none'}} to='/womens'>WOMEN</Link>  {menu==="womens"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("kids")}}> <Link style={{textDecoration:'none'}} to='/kids'>KIDS</Link>  {menu==="kids"?<hr/>:<></>}</li>
      </ul>

      <div className='nav-login-cart'> 
        {localStorage.getItem('auth-token')?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Logout</button>
        :<Link to='/login'><button> Login</button></Link>}
        <Link to='/cart'><img src={cart_icon} alt=''/></Link>
        <div className='nav-cart-count'>{getTotalCartItems()}</div>
      </div>
    </div>
  )
}
/*
localStorage là một phần của Web Storage API được cung cấp bởi trình duyệt web. Nó cho phép lưu trữ dữ liệu một cách đơn giản và bền vững (tồn tại ngay cả khi bạn đóng trình duyệt).
Bạn không cần phải khai báo localStorage trong mã của mình; nó có sẵn toàn cầu khi bạn làm việc với các ứng dụng web trong trình duyệt

Xóa dữ liệu:
  localStorage.removeItem(key) để xóa một mục cụ thể.
  localStorage.clear() để xóa tất cả dữ liệu trong localStorage.  
*/
export default Navbar;
  