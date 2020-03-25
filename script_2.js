let registryUri = undefined;
let currentLightValue = undefined;
let currentNonceValue = undefined;

const loadFilesModule = () => {
  dappyRChain
    .fetch("dappy://rchain/betanetwork/REGISTRY_URI")
    .then(a => {
      console.log(a);
      const rholangTerm = JSON.parse(a).expr[0];
      const jsObject = blockchainUtils.rhoValToJs(rholangTerm);
      console.log(jsObject);
      registryUri = jsObject.registryUri.replace("rho:id:", "");
      currentNonceValue = jsObject.nonce;
      console.log("registryUri is", registryUri);
      console.log("currentNonceValue is", currentNonceValue);
    })
    .catch(err => {
      console.log(err);
    });
};
loadFilesModule();
