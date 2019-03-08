let price = 0
let discount = 0
let pathname = window.location.pathname
let pathnames = pathname.split("/")
let coupons
let coupon = pathnames[pathnames.length - 1]
let plan

fetch('/api/coupon')
.then((res) => res.json())
.then((data) => {
  coupons = data.coupons
})

const promoCodes = { "ct15": 0.15, "ct25": 0.25, "ct30": 0.3 }

const solo = document.getElementById("solo");
const firm = document.getElementById("firm");
const bigFirm = document.getElementById("bigFirm");
const discountObj = document.getElementById("discount");
const totalPrice = document.getElementById("totalPrice");
const promoCode = document.getElementById("promoCode");

const updatePrice = () => {
    let matchCode;
    coupons.forEach((code) => {
      if(code.id === coupon){
        matchCode = code;
      }
    }) 
    if(matchCode){
      discount = (matchCode.percent_off/100) * price
    }
    const totalprice = document.createTextNode(`Total Price: ${(price - discount) * 12}`);
    const discountText = document.createTextNode(`Discounts: ${discount * 12}`);
    if(totalPrice.firstChild){
        totalPrice.firstChild.remove()
        discountObj.firstChild.remove()
    }
   
    discountObj.appendChild(discountText)
    totalPrice.appendChild(totalprice);
}

fetch('/api/products/prod_EepaojYpVep2Ay/plans')
.then((res) => res.json())
.then((data) => {
})

solo.addEventListener("click", () => {
    price = 65;
    plan = "plan_Eepka9EdjmNRVE"
    updatePrice()
})

firm.addEventListener("click", () => {
    price = 600;
    plan = "plan_EeqIuoK4b3v1NR"
    updatePrice()
})

bigFirm.addEventListener("click", () => {
    price = 900;
    plan = "plan_EeqKOEwLqjcP1x"
    updatePrice()
})

// promoCode.addEventListener("input", () => {
//     const code = promoCode.value;
//     if(Object.keys(promoCodes).includes(code)){
//         discount = promoCodes[code] * price;
//     }else {
//         discount = 0
//     }
//     updatePrice()
// })

var handler = StripeCheckout.configure({
    key: 'pk_test_vl3uMYsGl2xFsIRTKGFeB7Gb',
    image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
    locale: 'auto',
    token: function(token) {
      fetch("/api/subscribe", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          coupon
        })
    })
    .then(response => response.json())
    .then(() => {

    });
    }
  });
  
  document.getElementById('customButton').addEventListener('click', function(e) {
    // Open Checkout with further options:
    handler.open({
      name: 'Stripe.com',
      description: '2 widgets',
      zipCode: true,
      amount: (price - discount) * 12* 100
    });
    e.preventDefault();
  });
  
  // Close Checkout on page navigation:
  window.addEventListener('popstate', function() {
    handler.close();
  });
