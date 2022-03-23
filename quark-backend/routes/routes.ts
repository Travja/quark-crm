// const config = require('../config');
import express from 'express';
import mongoose from 'mongoose';

// const stats = require('../stats');

//Setup Mongoose
mongoose.Promise = global.Promise;
let bcrypt = require('bcryptjs');
let orderSchema: mongoose.Schema = new mongoose.Schema({
  customer: String,
  lastContact: Date,
  orderDate: Date,
  dueDate: Date,
  history: String,
  orderStatus: String,
  treeStatus: String,
  artist: String,
  orderNotes: String,
  treeType: String,
  generations: Number,
  printType: String,
  size: String,
  income: Number,
  vendor: String,
  expenses: Number
  //profit: Number // This should be derived
});
let userSchema: mongoose.Schema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  roles: [String]
});
let User: mongoose.Model<any, {}, {}, {}>;
let Order: mongoose.Model<any, {}, {}, {}>;


mongoose.connect(`mongodb+srv://Travja:${process.env.QUARK_PASSWORD}@quark.ibnpd.mongodb.net/Quark?retryWrites=true&w=majority`, {
  autoCreate: true
}, (error: mongoose.CallbackError) => {
  if (error) {
    console.error.bind(console, 'connection error');
    console.error(error);
  } else {
    Order = mongoose.model('Orders', orderSchema);
    User = mongoose.model('Users', userSchema);
    console.log('Connected to MongoDB');
  }
});

const create = (req: express.Request, res: express.Response) => {
  let salt = bcrypt.genSaltSync(10);
  let user = new User({
    username: 'Travja',
    password: bcrypt.hashSync('test', salt),
    email: 'the.only.t.craft@gmail.com',
    roles: ['ADMIN']
  });

  user.save((err: any, user: any) => {
    if (err) {
      res.send({
        error: err,
        message: 'Failed'
      });
      return;
    }

    res.send(user);
  });
};

const login = (req: express.Request, res: express.Response) => {
  let body = req.body;

  console.log(body);

  if (!body || !body.username || !body.password) {
    res.status(401).json({ error: 'Missing username/password', authorized: false });
    return;
  }

  let username = body.username;
  let pass = body.password;

  User.findOne({ username }, (err: any, user: any) => {
    if (err) {
      res.status(400).json({ error: err, authorized: false });
      return;
    } else if (!user) {
      res.status(400).json({ error: 'Unauthorized', authorized: false });
      return;
    }

    let match = bcrypt.compareSync(pass, user.password);

    console.log('Passwords match? ' + match);

    if (match) {
      res.json({ authorized: true, username: user.username, email: user.email });
      return;
    } else {
      res.status(401).json({ error: 'Unauthorized', authorized: false });
    }
  });
};

const data = (req: express.Request, res: express.Response) => {
  Order.find((err: any, data: any[]) => {
    if (err) {
      res.status(400).json({ error: err, success: false });
      return;
    }

    res.send({ data, success: true });
  });
};

const newOrder = (req: express.Request, res: express.Response) => {
  res.send({ error: 'Not yet implemented' });
};

export const routes = { create, login, data, newOrder };
