# Campus Snack Bar POS

A simple point-of-sale web app for a campus snack bar (IT 415 midterm practical exam, Scenario 4).
Built with plain HTML, internal CSS and JavaScript. No database: the cart and transaction live in the browser tab (sessionStorage).

## Pages
| Page | Step |
|---|---|
| `index.html` | Browse products and add to cart |
| `cart.html` | Review order, change quantities, remove items |
| `payment.html` | Enter cash, validate, compute change |
| `confirmation.html` | Payment confirmation with transaction details |
| `receipt.html` | Digital receipt and start a new transaction |

## Run
Open `index.html` in a browser. Product images are in `images/`; shared data and helpers are in `js/store.js`.

## Validation
Blank, non-numeric and negative amounts show "Please enter a valid payment amount."; amounts below the total show "Insufficient payment. Please enter at least ₱X."
