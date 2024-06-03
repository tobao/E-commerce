import React, { useEffect, useState } from 'react'
import './Popular.css'
import data_product from '../Assets/data'
import Item from '../Item/Item'

const Popular = () => {
  // const [popularProducts,setPopularProducts]= useState([]);
  ////data_product.map((item,i)
  // useEffect(()=>{
  //   fetch('http://localhost:4000/popularinwomen')
  //   .then((response)=>response.json())
  //   .then((data)=>setPopularProducts(data));
  // },[]);

  /*
useEffect được sử dụng để thực hiện các hiệu ứng phụ, trong trường hợp này là lấy dữ liệu từ một API.
  Hàm fetch thực hiện một yêu cầu GET đến http://localhost:4000/popularinwomen.
  Phản hồi được chuyển đổi thành JSON.
  Dữ liệu JSON sau đó được sử dụng để cập nhật trạng thái popularProducts

Code cải thiện:
  const [popularProducts, setPopularProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/popularinwomen');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPopularProducts(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPopularProducts();
  }, []);
*/
  return (
    <div className='popular'>
      <h1>POPULAR IN WOMEN</h1>
      <hr/>
      <div className="popular-item">
        {data_product.map((item,i)=>{
          return <Item key={i} 
                       id={item.id} 
                       name={item.name} 
                       image={item.image} 
                       new_price={item.new_price} 
                       old_price={item.old_price} />
        })}
      </div>
    </div>
  )
}

export default Popular