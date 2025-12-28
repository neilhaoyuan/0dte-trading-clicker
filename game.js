/*
Normal distribution functions
Source - https://stackoverflow.com/a
Posted by Steve Zelaznik, modified by community.
Retrieved 2025-12-28, License - CC BY-SA 3.0
*/

function normal(x, mu, sigma) {
    return stdNormal((x-mu)/sigma);
}

function stdNormal(z) {
    var k, m, values, total, item, z2, z4, a, b;

    // Power series is not stable at these extreme tail scenarios
    if (z < -6) { return 0; }
    if (z >  6) { return 1; }

    m      = 1;        // m(k) == (2**k)/factorial(k)
    b      = z;        // b(k) == z ** (2*k + 1)
    z2     = z * z;    // cache of z squared
    z4     = z2 * z2;  // cache of z to the 4th
    values = [];

    // Compute the power series in groups of two terms.
    // This reduces floating point errors because the series
    // alternates between positive and negative.
    for (k=0; k<100; k+=2) {
        a = 2*k + 1;
        item = b / (a*m);
        item *= (1 - (a*z2)/((a+1)*(a+2)));
        values.push(item);
        m *= (4*(k+1)*(k+2));
        b *= z4;
    }

    // Add the smallest terms to the total first that
    // way we minimize the floating point errors.
    total = 0;
    for (k=49; k>=0; k--) {
        total += values[k];
    }

    // Multiply total by 1/sqrt(2*PI)
    // Then add 0.5 so that stdNormal(0) === 0.5
    return 0.5 + 0.3989422804014327 * total;
}

/*
Black Scholes Pricing Formula
*/

// S = underlying price, K = strike, r = risk free rate, t = time, sigma = sigma volatility, type = "call" or "put"
function blackScholes(S, K, T, r, sigma, type){
    const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - (sigma * Math.sqrt(T))

    let price;

    if (type == "call"){
        price = S * stdNormal(d1) - K * Math.exp(-r * T) * stdNormal(d2)
    } else {
        price = K * Math.exp(-r * T) * stdNormal(-d2) - S * stdNormal(-d1)
    }

    return price
}