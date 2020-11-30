let registryUri = undefined;
let currentLightValue = undefined;
let currentNonceValue = undefined;
let publicKey = undefined;

if (typeof dappyRChain !== "undefined") {
  dappyRChain
    .fetch("dappy://REGISTRY_URI")
    .then((a) => {
      const rholangTerm = JSON.parse(a).expr[0];
      const jsObject = blockchainUtils.rhoValToJs(rholangTerm);
      registryUri = jsObject.registryUri.replace("rho:id:", "");
      currentNonceValue = jsObject.nonce;
      publicKey = jsObject.publicKey;
      console.log("publicKey is", publicKey);
      console.log("registryUri is", registryUri);
      console.log("currentNonceValue is", currentNonceValue);
    })
    .catch((err) => {
      console.log(err);
    });
}
