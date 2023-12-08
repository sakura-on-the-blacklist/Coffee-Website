const express = require('express')
const app = express()
const cors = require('cors')
const mysql = require('mysql2');
const crypto = require('crypto-js');
var jwt = require('jsonwebtoken');
const{ listen } = require('express/lib/application')
const port = 5555

app.use(express.json())
app.use(cors())

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'burger' //db name
  });

  app.get('/', (req,res)=>{
    res.send('hello')
  })

  //////////sign up

  app.post('/customersSignUp', (req, res) => {
 
    if (!req.body.username || !req.body.email || !req.body.mobile_number || !req.body.password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    conn.query("SELECT * FROM customer WHERE username = ? OR email = ?", [req.body.username, req.body.email], (error, existingData) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (existingData.length > 0) {
        
        return res.status(400).json({ error: 'Username or email already exists. Please choose different data.' });
      }
  
    
      conn.query("INSERT INTO customer(username, email, mobile_number, password, role) VALUES (?,?,?,?,?)",
        [req.body.username, req.body.email, req.body.mobile_number, req.body.password, 0],
        (insertError, data) => {
          if (insertError) {
            console.error(insertError);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
  
          console.log(data);
          res.status(201).json({ success: true, data });
        }
      );
    });
  });
  


  ////getting the list of foods is available to everyone

  app.get('/getFoods', (req, res)=>{
    conn.query("SELECT * FROM food", (error, data)=>{
        if(error==null){
            res.send(data)
        }else{
            res.send(error)
        }
    })
  })



  //////////login&authentication/////////

   app.post('/login', (req, res) => {
    conn.query("SELECT * FROM customer WHERE email = ? AND password = ?", [req.body.email, req.body.password], (error, results) => {
      if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Internal Server Error' });
      }

      if (results.length === 0) {
          return res.status(401).json({ message: 'User does not exist or wrong credentials' });
      }

      const user = results[0];

      // Now you have the user data, and you can proceed with further checks or actions.
      const secretKey = 'ifhvseiguehrifvuejsrfiu';
      const token = jwt.sign({ customer_id: user.customer_id, email: user.email, role: user.role }, secretKey, { expiresIn: '1h' });

      res.status(200).json({ message: 'Login successful', token });
  });
});


  //MIDDLEWARE//
  // Middleware for login user authorization
const authToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  const token = authHeader.split(" ")[1];
  console.log(token);

  try {
      const decoded = jwt.verify(token, 'ifhvseiguehrifvuejsrfiu');
      console.log(decoded);
      req.user = decoded;
      next();
  } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Unauthorized token" });
  }
};

function adminToken(req,res,next){

  if(req.user.role == 1){
    next()
  }else{
    res.send({message: "access denied"})
  }

}


///////User order system
app.post('/placeOrder', authToken, (req, res) => {

  const customer_id = req.user.customer_id;

  if (!customer_id) {
    return res.status(400).json({ error: 'Customer ID is missing or invalid.' });
  }

  conn.query("INSERT INTO cust_order (customer_id) VALUES (?)", [customer_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to insert order.' });
    }

    const order_id = results.insertId;

  
    conn.query("INSERT INTO food_order (food_id, order_id, quantity) VALUES (?, ?, ?)", [req.body.food_id, order_id, req.body.quantity], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to insert food order.' });
      }

    
      conn.query("INSERT INTO location (customer_id, city, barangay, address) VALUES (?, ?, ?, ?)", [customer_id, req.body.city, req.body.barangay, req.body.address], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to insert location.' });
        }
        res.send('Order placed successfully');
      });
    });
  });
});

/////////displaying only their orders
app.get('/displayYourOrder', authToken, (req, res) => {
  const customer_id = req.user.customer_id;

  const query = `
    SELECT f.food_name, fo.quantity, co.status
    FROM food_order fo
    INNER JOIN cust_order co ON fo.order_id = co.order_id
    INNER JOIN customer c ON co.customer_id = c.customer_id
    INNER JOIN food f ON fo.food_id = f.food_id
    WHERE c.customer_id = ?
  `;

  conn.query(query, [customer_id], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json(results);
  });
});


//////////displaying the ALL orders (available for admins)
app.get('/displayOrder', authToken, adminToken, (req, res)=>{
  conn.query(`SELECT fo.order_id, 
  f.food_name, 
  fo.quantity, 
  c.username, 
  co.status,
  l.city,
  l.barangay,
  l.address
  FROM food_order fo INNER JOIN food cust_order co 
  ON fo.order_id = co.order_id 
  INNER JOIN customer c ON co.customer_id = c.customer_id 
  INNER JOIN food f ON fo.food_id = f.food_id
  INNER JOIN location l ON l.customer_id = c.customer_id
  WHERE f.quantity != 0`, (error, data)=>{
    if(error==null){
      res.send(data);
    }else{
      res.send(error);
    }
  })
})


/////////Admin can change the status according to resto's order progress
app.put('/editStatus', authToken, adminToken, (req, res)=>{
  conn.query(`UPDATE cust_order SET status=${req.body.status} WHERE order_id = ${req.params.order_id}`, (error, data)=>{
    if(error == null){
      res.send(data);
    }else{
      res.send(error);
    }
  })
})

////////Delete the order if the status becomes DELIVERED



  ////posting foods is only allowed by admins
  app.post('/postFood', authToken, adminToken,(req,res)=>{
    console.log(req.user.role)

    conn.query("INSERT INTO food(food_name, description, price, quantity) VALUES (?,?,?,?)", [req.body.food_name, req.body.description, req.body.price, req.body.quantity], (error, data)=>{
      if(req.body.food_name != undefined && req.body.description != undefined && req.body.price && req.body.quantity){
        
        console.log(req.body)
        res.send(data)
        }else{
          res.send(error)
        }
        })
      }
  )

  //////Menu updates
  app.put('/updateMenu/:food_id', authToken, adminToken, (req, res) => {
    const { food_name, description, price, quantity } = req.body;
    const foodId = req.params.food_id;

    const setFields = [];
    if (food_name !== undefined) setFields.push(`food_name = "${food_name}"`);
    if (description !== undefined) setFields.push(`description = "${description}"`);
    if (price !== undefined) setFields.push(`price = ${price}`);
    if (quantity !== undefined) setFields.push(`quantity = ${quantity}`);
  
    const setClause = setFields.join(', ');
  
    const sqlQuery = `UPDATE food SET ${setClause} WHERE food_id = ${foodId}`;
  
    conn.query(sqlQuery, (error, data) => {
      if (error === null) {
        res.send(data);
      } else {
        res.send(error);
      }
    });
  });
  
  

  /////Delete the Food from the menu completely
  // app.delete('/deleteFood/:food_id', authToken, adminToken, (req,res)=>{
  //   conn.query(`DELETE FROM food WHERE food_id = ${req.params.food_id}`, (error, data)=>{
  //     if(error==null){
  //       res.send(data);
  //     }else{
  //       res.send(error);
  //     }
  //   })
  // })

  //////soft delete the food

app.delete('/deleteFood/:food_id', authToken, adminToken, (req, res) => {
  const foodId = req.params.food_id;
  const sqlQuery = `UPDATE food SET deleted_at = CURRENT_TIMESTAMP WHERE food_id = ${foodId}`;

  conn.query(sqlQuery, (error, data) => {
    if (error === null) {
      res.send(data);
    } else {
      res.send(error);
    }
  });
});

  ///////item restoration
  app.put('/restoreMenu/:food_id', authToken, adminToken, (req, res) => {
    const foodId = req.params.food_id;
  
    const sqlQuery = `UPDATE food SET deleted_at = NULL WHERE food_id = ${foodId}`;
  
    conn.query(sqlQuery, (error, data) => {
      if (error === null) {
        res.send(data);
      } else {
        res.send(error);
      }
    });
  });
  

  //////only admin can see the list of custoemrs
  app.get('/getCust', authToken, adminToken, (req,res)=>{
    conn.puery("SELECT * FROM customer",(error,data)=>{
      if(error == null){
        res.send(data)
      }else{
        res.send(error)
      }
    })
  })


  /////ok!
  app.get('/protected', authToken, adminToken,(req,res)=>{
    res.json({
      message:"yey! you gone thru middleware"
    })
  })


  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })