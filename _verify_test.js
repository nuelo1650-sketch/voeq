const { jwtVerify } = require('/c/Users/GTHub/OneDrive/Desktop/voeq/node_modules/jose');
const fs = require('fs');
const secret = fs.readFileSync('/tmp/api_auth_secret.txt', 'utf8').trim();
const tok = process.argv[1];
(async () => {
  try {
    const { payload } = await jwtVerify(tok, new TextEncoder().encode(secret));
    console.log('VERIFY OK sub=' + payload.sub + ' role=' + payload.role + ' vs=' + payload.vendorStatus + ' jti=' + payload.jti);
  } catch (e) {
    console.log('VERIFY FAIL: ' + e.message);
  }
})();
