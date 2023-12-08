import {useState, useEffect} from 'react'
import './Menu.css'

export const Menu = ()=>{
    const[foods, setFoods] = useState([]);
    const selectedFoodIds = [1,5,9,14];

    useEffect(()=>{
        fetch('http://localhost:5555/getFoods',{
            method:"GET",
            headers: {
                "Content-Type" : "application/json",
            },
        })
        .then((res)=>res.json())
        .then((allFoods) => {
            // Filter the fetched menu items based on selectedFoodIds
            const filteredFoods = allFoods.filter((food) =>
              selectedFoodIds.includes(food.food_id)
            );
            setFoods(filteredFoods);
          })
          .catch((error) => {
            console.error('Error fetching menu:', error);
          });
      }, []);

    return(
        <>
        
        <section id="menu" className="section menu">
        <div className="menu-header">
            <span className="title">Our Menu</span>
            <span className="sub-title">Our Popular Menu</span>
        </div>
        <div className="menu-container">
          {foods.map((food) => (
            <div className="container" key={food.food_id}>
              {/* <!-- Canvas for Image --> */}
              <div className="canvas">
                  <canvas id="canvas"></canvas>
              </div>
              
              {/* <!-- Product Name --> */}
              <div className="product-name">{food.food_name}</div>

              {/* <!-- Food Description --> */}
              <div className="product-description">
                  <p>{food.description}</p>
              </div>

               {/* Price and order Buttons */}
              <div className="product-info">
                  <div className="product-cost">P{food.price}</div>
                  <button className="order-button" onclick="showSignIn()">Order now</button>
              </div>
            </div>
          ))}</div>
          </section>
        </>
    )
}