Official payment logos
----------------------
1. Download each logo from the provider's official brand page (SVG preferred, otherwise PNG).
2. Save the files in this folder with these names:
   visa.svg  mastercard.svg  paypal.svg  applepay.svg  usdt.svg
   (use .png instead if that is what you have)
3. Open assets/guru-pay.js and fill LOGOS with the same file names, e.g.
   var LOGOS = { visa: 'visa.svg', mastercard: 'mastercard.svg', paypal: 'paypal.svg', applepay: 'applepay.svg', usdt: 'usdt.svg' };
A method with no file listed keeps showing its icon and name.
Use the logos as supplied (no recolouring or stretching) and follow each provider's brand guidelines.
