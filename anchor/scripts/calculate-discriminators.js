const { createHash } = require("crypto");

function sighash(nameSpace, name) {
    const preimage = `${nameSpace}:${name}`;
    return Buffer.from(
        createHash("sha256")
            .update(preimage)
            .digest()
            .slice(0, 8)
    );
}

const createPaymentDiscriminator = sighash("global", "create_payment");
const fulfillPaymentDiscriminator = sighash("global", "fulfill_payment");

console.log("Create Payment Discriminator:", Array.from(createPaymentDiscriminator));
console.log("Fulfill Payment Discriminator:", Array.from(fulfillPaymentDiscriminator)); 