const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


const Users = require('./auth-model')
const  {jwtSecret } = require('../config/secrets')

router.post('/register', (req, res) => {
  let user = req.body
  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;

  Users.addUser(user)
  .then(newUser => {
    res.status(201).json(newUser)
  })
  .catch(error => {
    res.status(500).json({ message: "Error adding user" });
  });
});

router.post('/login', (req, res) => {
  let {username, password} = req.body;

  Users.findBy({username})
  .first()
  .then(user => {
    if (user && bcrypt.compareSync(password, user.password)){
      const token = generateToken(user);
      
      res.status(200).json({ message: `Welcome, ${user.username}!`, token });
    } else {
      res.status(401).json({ message: "You shall not pass!" });
    }
  })
  .catch(error => {
    res.status(500).json({ message: "Error logging in" });
  });
});



function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  
  };

  const options = {
    expiresIn: "1h"
  };

  return jwt.sign(payload, jwtSecret, options);
}


module.exports = router;
