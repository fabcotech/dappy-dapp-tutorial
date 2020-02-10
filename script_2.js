const loadUnforgeableName = () => {
  dappyRChain
    .fetch("dappy://rchain/alphanetwork/UNFORGEABLE_NAME_1")
    .then(a => {
      const response = JSON.parse(a);
      const rholangTerm = response.expr;
      const jsObject = blockchainUtils.rhoValToJs(rholangTerm);
      registryUri = jsObject.registry_uri;
      lightUnforgeableName = jsObject.unforgeable_name_light.UnforgPrivate;
      console.log("lightUnforgeableName is ", lightUnforgeableName);
      console.log("registryUri is ", registryUri);
    })
    .catch(err => {
      console.log(err);
    });
};

loadUnforgeableName();
