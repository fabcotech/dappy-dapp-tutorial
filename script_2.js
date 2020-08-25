let registryUri = undefined;
let currentLightValue = undefined;
let currentNonceValue = undefined;

if (typeof dappyRChain !== "undefined") {
  const loadFilesModule = () => {
    dappyRChain
      .fetch("dappy://REGISTRY_URI")
      .then((a) => {
        console.log(a);
        const rholangTerm = JSON.parse(a).expr[0];
        const jsObject = blockchainUtils.rhoValToJs(rholangTerm);
        registryUri = jsObject.registryUri.replace("rho:id:", "");
        currentNonceValue = jsObject.nonce;
        console.log("registryUri is", registryUri);
        console.log("currentNonceValue is", currentNonceValue);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  loadFilesModule();
}
