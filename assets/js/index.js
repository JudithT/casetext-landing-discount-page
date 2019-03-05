let price = 0
let discount = 0

const promoCodes = { "ct15": 0.15, "ct25": 0.25, "ct30": 0.3 }

const solo = document.getElementById("solo");
const firm = document.getElementById("firm");
const bigFirm = document.getElementById("bigFirm");
const discountObj = document.getElementById("discount");
const totalPrice = document.getElementById("totalPrice");
const promoCode = document.getElementById("promoCode");

const updatePrice = () => {
    const totalprice = document.createTextNode(`Total Price: ${(price - discount) * 12}`);
    const discountText = document.createTextNode(`Discounts: ${discount * 12}`);
    if(totalPrice.firstChild){
        totalPrice.firstChild.remove()
        discountObj.firstChild.remove()
    }
   
    discountObj.appendChild(discountText)
    totalPrice.appendChild(totalprice);
}
solo.addEventListener("click", () => {
    price = 65;
    updatePrice()
})

firm.addEventListener("click", () => {
    price = 600;
    updatePrice()
})

bigFirm.addEventListener("click", () => {
    price = 900;
    updatePrice()
})

promoCode.addEventListener("input", () => {
    const code = promoCode.value;
    if(Object.keys(promoCodes).includes(code)){
        discount = promoCodes[code] * price;
    }else {
        discount = 0
    }
    updatePrice()
})

var handler = StripeCheckout.configure({
    key: 'pk_test_vl3uMYsGl2xFsIRTKGFeB7Gb',
    image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
    locale: 'auto',
    token: function(token) {
      // You can access the token ID with `token.id`.
      // Get the token ID to your server-side code for use.
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
