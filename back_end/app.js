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

  //////////login&authentication/////////

  app.post('/login', (req,res)=>{
    var user = conn.query.find((x)=> x.email == req.body.email && x.password == req.body.password);

    if(user == null){
      return res.send({message: "user does not exist"});
    }else{
      if(user.password == req.body.password){
        const secretKey = crypto.randomBytes(32).toString('hex');

        var token = jwt.sign(user,secretKey, {expiresIn: '1h'});
      }else{
        return res.send({message: "wrong password"});
      }
    }
  })

  //MIDDLEWARE//
  const authenticateToken = (req,res,next)=>{
    const authHeader = request.headers["authorization"];
    console.log(authHeader);

    var token = null;
    if(authHeader != undefined && authHeader != null){
      token = authHeader.split(" ")[1]
    }else{
      jwt.verify(token, secretKey, (error, res)=>{
        if(error){
          res.send({message: "unauthorized token"});
          return;
        }
        req.user = res;
      })
      next();
    }
  }

  app.post('')

  app.get('/foods', (req, res)=>{
    conn.query("SELECT * FROM food", (error, data)=>{
        if(error==null){
            res.send(data)
        }else{
            res.send(error)
        }
    })
  })

  app.post('/customers', (req,res)=>{
    conn.query("INSERT INTO customer( last_name, first_name, email, mobile_number, password) VALUES (?,?,?,?,?)", [req.body.last_name, req.body.first_name, req.body.email, req.body.mobile_number, req.body.password], (error, data)=>{
        if(req.body.last_name!= undefined && req.body.first_name != undefined && req.body.email != undefined && req.body.mobile_number != undefined && req.body.password != undefined){
            console.log(req.body)
            res.send(data)
        }else{
            res.send(error)
        }
    })
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })