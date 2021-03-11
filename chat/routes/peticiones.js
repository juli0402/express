var express = require('express');
var router = express.Router();
const fs = require("fs");
const { arch } = require('os');
const Joi = require('joi');


router.get('/messages', (req, res) => {
  res.status(200).send(JSON.parse(fs.readFileSync("./message.json")));
});

router.get('/messages/:ts', (req, res) => {
  let ts = req.params.ts;
  let json = JSON.parse(fs.readFileSync("./message.json"));
  let message;
  for (let i = 0; i < json.length; i++) {
    if (json[i].ts == ts) {
      message = element;
    }
  }
  if (message) {
    res.status(200).send(message);
  }
  else {
    res.status(404);
  }
});

let archivo = fs.readFileSync("./message.json", { encoding: 'utf-8', flag: 'r' });
archivo = archivo.slice(1, -1);
let array = archivo.split('}",');
for (let i = 0; i < array.length - 1; i++) {
  array[i] = array[i] + '}"';
}

router.post('/messages', (req, res) => {
  const bodyRequest = req.body;
  res.status(200).send(bodyRequest);
  let nuevo = JSON.stringify(bodyRequest);
  nuevo = nuevo.replace(/"/g, '\\\"');
  nuevo = nuevo.replace('{', '"{');
  nuevo = nuevo.replace('}', '}"');
  array.push(nuevo);
  let string = array.toString();
  string = '[' + string + ']';
  fs.writeFileSync("./message.json", string);
});

router.put('/messages/:ts', (req, res) => {
  let ts = req.params.ts;
  let bodyRequest = req.body;
  bodyRequest['ts'] = ts;
  let json = JSON.parse(fs.readFileSync("./message.json"));
  let message = false;
  let messages = [];
  for (let i = 0; i < json.length; i++) {
    if (json[i].ts == bodyRequest.ts) {
      json[i].message = bodyRequest.message;
      message = true;
    }
    messages.push(json[i]);
  }
  fs.writeFile('./message.json', JSON.stringify(messages));
  res.status(200);
});


router.delete('/messages/:ts', (req, res) => {
  let ts = req.params.ts;
  let json = JSON.parse(fs.readFileSync("./message.json"));
  let messages = [];
  let message;
  for (let i = 0; i < json.length; i++) {
    messages.push(json[i]);
    if (json[i].ts == ts) {
      message = messages.pop();
    }

  }
  fs.writeFile('./message.json', JSON.stringify(messages));
  if (message) {
    res.status(200);
  }
  else {
    res.status(404);
  }
});

const validate = (data) => {
  const schema = Joi.object({
    author: Joi.string().pattern(new RegExp("([A-zÀ-ú])\\s([A-zÀ-ú])")).required(),
    message: Joi.string().required().min(5),
    ts: Joi.number(),
  }).options({ abortEarly: false });

  return schema.validate(data);
}

module.exports = router;
