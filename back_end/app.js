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
      const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });

      res.status(200).json({ message: 'Login successful', token });
  });
});


  //MIDDLEWARE//
  const authToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    const token = authHeader.split(" ")[1];
    console.log(token);

    jwt.verify(token, 'ifhvseiguehrifvuejsrfiu', (error, decoded) => {
        if (error) {
            console.error(error);
            return res.status(401).json({ message: "Unauthorized token" });
        }

        // Assign the decoded user information to the request object
        req.user = decoded;

        // Call the next middleware in the stack
        next();
    });
};

  

  ////posting foods is only allowed by admins
  app.post('/postFood', authToken,(req,res)=>{
    if(req.user.role == 1){
    conn.query("INSERT INTO food(food_name, description, price, quantity) VALUES (?,?,?,?)", [req.body.food_name, req.body.description, req.body.price, req.body.quantity], (error, data)=>{
      if(req.body.food_name != undefined && req.body.description != undefined && req.body.price && req.body.quantity){
        
        console.log(req.body)
        res.send(data)
        }
        })
      }else{
        res.send({message: "has no authorization"})
      }
  })


  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })