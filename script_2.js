const loadFilesModule = () => {
  dappyRChain
    .fetch("dappy://rchain/betanetwork/REGISTRY_URI")
    .then(a => {
      console.log(a);
      const rholangTerm = JSON.parse(a).expr[0];
      const jsObject = blockchainUtils.rhoValToJs(rholangTerm);
      console.log(jsObject);
      filesRegistryUri = jsObject.filesRegistryUri.replace("rho:id:", "");
      entryRegistryUri = jsObject.entryRegistryUri.replace("rho:id:", "");
      currentNonceValue = jsObject.nonce;
      console.log("filesRegistryUri is", filesRegistryUri);
      console.log("entryRegistryUri is", entryRegistryUri);
      console.log("currentNonceValue is", currentNonceValue);
    })
    .catch(err => {
      console.log(err);
    });
};
loadFilesModule();
