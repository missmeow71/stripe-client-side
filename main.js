const publicStripeKey = 'pk_test_TQFCOtxleoeIjE9QXzRL9Xla';
const purchaseData = {
  amount: 0
};

var handler = StripeCheckout.configure({
  key: publicStripeKey,
  image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
  locale: 'auto',
  token: function (token) {

    const payload = {
      stripeToken: token.id,
      amount: purchaseData.amount
    };

    fetch('https://sooodonenow.herokuapp.com/accept-payment', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => {
        const statusElement = document.querySelector('#paid-status');
        if (res.failure_code) {
          displayError(new Error('There was an error processing your credit card'), statusElement)
        } else {
          const message = `Your card was charged $${res.amount / 100}`;
          statusElement.innerHTML = message;
        }
      })
      .catch(displayError);
  }
});

document.querySelector('#customForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = new FormData(e.target);
  const cents = Number(form.get('amount'));
  const amount = cents * 100;

  purchaseData.amount = amount;

  if (amount) {
    handler.open({
      name: 'Demo Site',
      description: '2 widgets',
      amount
    });
  };
});

window.addEventListener('popstate', function () {
  handler.close();
});

const displayError = (err, statusElement) => {
  const message = `There was an error processing your credit card: ${err.message}`;
  statusElement.innerHTML = message;
};