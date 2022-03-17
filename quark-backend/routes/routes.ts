// const config = require('../config');
import express from 'express';
import mongoose from 'mongoose';

// const stats = require('../stats');

export class Routes {
  bcrypt = require('bcryptjs');
  orderSchema: mongoose.Schema;
  userSchema: mongoose.Schema;
  User: mongoose.Model<any, {}, {}, {}>;
  Order: mongoose.Model<any, {}, {}, {}>;

  constructor() {
    //Setup Mongoose
    mongoose.Promise = global.Promise;

    mongoose.connect(`mongodb+srv://Travja:${process.env.QUARK_PASSWORD}@quark.ibnpd.mongodb.net/Quark?retryWrites=true&w=majority`, {
      autoCreate: true
    }, (error: mongoose.CallbackError) => {
      if (error) {
        console.error.bind(console, 'connection error');
        console.error(error);
      } else {
        console.log('Connected to MongoDB');
      }
    });

    this.orderSchema = new mongoose.Schema({
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

    this.Order = mongoose.model('Orders', this.orderSchema);

    this.userSchema = new mongoose.Schema({
      username: { type: String, unique: true, required: true },
      password: { type: String, required: true },
      email: { type: String, required: true },
      roles: [String]
    });

    this.User = mongoose.model('Users', this.userSchema);
  }

  create = (req: express.Request, res: express.Response) => {
    let salt = this.bcrypt.genSaltSync(10);
    let user = new this.User({
      username: 'Travja',
      password: this.bcrypt.hashSync('test', salt),
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

  login = (req: express.Request, res: express.Response) => {
    let body = req.body;

    console.log(body);

    if (!body || !body.username || !body.password) {
      res.status(401).json({ error: 'Missing username/password', authorized: false });
      return;
    }

    let username = body.username;
    let pass = body.password;

    this.User.findOne({ username }, (err: any, user: any) => {
      if (err) {
        res.status(400).json({ error: err, authorized: false });
        return;
      } else if (!user) {
        res.status(400).json({ error: 'Unauthorized', authorized: false });
        return;
      }

      let match = this.bcrypt.compareSync(pass, user.password);

      console.log('Passwords match? ' + match);

      if (match) {
        res.json({ authorized: true, username: user.username, email: user.email });
        return;
      } else {
        res.status(401).json({ error: 'Unauthorized', authorized: false });
      }
    });
  };
}