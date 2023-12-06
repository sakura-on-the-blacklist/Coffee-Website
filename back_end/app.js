const express = require('express')
const app = express()
const cors = require('cors')
const mysql = require('mysql2');
const crypto = require('crypto-js');
var jwt = require('jsonwebtoken');
const{ listen } = require('express/lib/application')
const port = 3000

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
    // Input validation - Check for required fields
    if (!req.body.username || !req.body.email || !req.body.mobile_number || !req.body.password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Insert data into the database
    conn.query("INSERT INTO customer(username, email, mobile_number, password, role) VALUES (?,?,?,?,?)", 
        [req.body.username, req.body.email, req.body.mobile_number, req.body.password, 0], 
        (error, data) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            console.log(data);
            res.status(201).json({ success: true, data });
        }
    );
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
      const token = jwt.sign({ id: user.customer_id, email: user.email, role: user.role }, secretKey, { expiresIn: '1h' });

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





function adminToken(req,res,next){

  if(req.user.role == 1){
    next()
  }else{
    res.send({message: "access denied"})
  }

}

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