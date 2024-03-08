'use strict';
import {} from 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.MY_PWD,
  },
});

async function sendMsg(subject, text, auth, res) {
  if (!auth === process.env.AUTH) {
    res.status(400).send();
  }
  const mailOptions = { from: process.env.EMAIL, to: process.env.TO, subject, text };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(400).send();
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send();
    }
  });
}

const port = process.env.PORT || 3001;

// Start the server.
const app = express();
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});

// Log all requests to the server
const myLogger = function (req, _, next) {
  console.log(`Incoming: ${req.url}`);
  next();
};

// Middleware
app.use(express.json({ limit: '200kb' }));
app.use(express.static('public'));
app.use(cors());
app.use(myLogger);

app.post('/send', async function (req, res) {
  console.log(req.body);
  sendMsg(req.body.subject, req.body.text, req.body.auth, res);
});
