const request = require('request');

const jwksUrl = 'https://dev-clq116aa.auth0.com/.well-known/jwks.json'
let jwks = "";
var jksCertObject = new Object();

function getJwksCert(inputURL) {
  request({
    uri: jwksUrl,
    strictSsl: true,
    json: true
  }, (err, res) => {
    if (err || res.statusCode < 200 || res.statusCode >= 300) {
      if (err) {
          reject(`ERROR: Get jwks return error: ${err}`);
          return;
      }     
      if (res) {
        reject(`ERROR: Get jwks return status code ${res.statusCode}`);
        return;
      }
    }
    
    var keys = res.body.keys;
    
    if (!keys || !keys.length) {
      console.log('ERROR: Get jwks: The JWKS endpoint did not contain any keys')
      return
    }
    
    const signingKeys = keys
    .filter(key => key.use === 'sig' // JWK property `use` determines the JWK is for signing
                && key.kty === 'RSA' // We are only supporting RSA (RS256)
                && key.kid           // The `kid` must be present to be useful for later
                && ((key.x5c && key.x5c.length) || (key.n && key.e)) // Has useful public keys
    ).map(key => {
      var cert = { kid: key.kid, nbf: key.nbf, publicKey: certToPEM(key.x5c[0]) };
      jksCertObject.cert = cert;
    });
  });
}

function certToPEM(cert) {
    cert = cert.match(/.{1,64}/g).join('\n');
    cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
    return cert;
}

getJwksCert(jwksUrl)
console.log( jksCertObject.cert )

function myFunc(arg) {
  console.log( jksCertObject.cert )
}

setTimeout(myFunc, 1500, 'funky');


