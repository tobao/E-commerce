import React, { useContext, useRef, useState } from 'react'
import './Navbar.css'
import logo from '../Assets/logo.png'
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
        <img src={logo} alt=''/>
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
        <Link to='/login'><button> Login</button></Link>
        <Link to='/cart'><img src={cart_icon} alt=''/></Link>
        <div className='nav-cart-count'>{getTotalCartItems()}</div>
      </div>
    </div>
  )
}

export default Navbar;
  