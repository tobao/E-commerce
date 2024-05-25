import React from 'react'
import './DescriptionBox.css'
const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Review (122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>An ecommerce website is an online store that allows businesses to sell products or services over 
      the internet to customers. Ecommerce websites can be designed to sell physical products, digital products, 
      or services. They typically include features such as product catalogs, pricing information, customer reviews,
      order tracking, customer accounts, and payment processing systems. </p>
        <p>Ecommerce can take many forms, such as online shopping, digital downloads, online subscriptions,
       and online ticketing. It has revolutionized the way people do business and has become an increasingly 
       popular way to shop due to its convenience and accessibility.</p>
      </div>
    </div>
  )
}

export default DescriptionBox