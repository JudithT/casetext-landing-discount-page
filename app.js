const express = require('express');
const bodyParser = require('body-parser');
const stripe = require("stripe")("sk_test_wXMJVckQKo8MTy0cIVJ5d0tl");
const products = [{name: "solo"}, {name: "firm"}, {name: "big firm"}]

// Set up the express app
const app = express();


app.use(express.static(`${__dirname}`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/products/add', async (req, res) => {
  try{
    const product = await stripe.products.create({
      name: req.body.name,
      type: 'service',
    })
    return res.send({
      success: true,
      product
    })
  }catch(e){
    return res.status(500).send({
      error: e.message
    })
  } 
})

app.post('/api/products/:id/plan', async (req, res) => {
  try{
    const plan = await stripe.plans.create({
      product: req.params.id,
      nickname: req.body.name,
      currency: 'usd',
      interval: 'year',
      amount: req.body.amount,
    });

    return res.send({
      success: true,
      plan
    })
  }catch(e){
    return res.status(500).send({
      error: e.message
    })
  } 
})

app.get('/api/products/:id/plans', async (req, res) => {
  try{
    const plans = await stripe.plans.list({
      product: req.params.id
    });

    return res.send({
      success: true,
      plans: plans.data
    })
  }catch(e){
    return res.status(500).send({
      error: e.message
    })
  } 
})

app.post('/api/coupon', async (req, res) => {
  try{
    const coupon = await stripe.coupons.create({
      duration: req.body.duration,
      id: req.body.code,
      percent_off: req.body.percent_off,
    });

    return res.send({
      success: true,
      coupon
    })
  }catch(e){
    return res.status(500).send({
      error: e.message
    })
  } 
})

app.get('/api/coupon', async (req, res) => {
  try{
    const coupons = await stripe.coupons.list();

    return res.send({
      success: true,
      coupons: coupons.data
    })
  }catch(e){
    return res.status(500).send({
      error: e.message
    })
  } 
})

app.post('/api/subscribe', async (req, res) => {
  try{
   await stripe.subscriptions.create({
      customer: 'cus_EdiG3cquvZVOZZ',
      items: [{plan: req.body.plan}],
      coupon: req.body.coupon,
    });
    return res.send({
      success: true,
    })
  }catch(e){
    return res.status(500).send({
      error: e.message
    })
  }
})

app.all('*', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

const port = process.env.PORT || 4000;
app.set('port', port);
app.listen(port, () => console.log('server started'));
