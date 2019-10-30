const loadUnforgeableName = () => {
  dappyRChain.fetch('dappy://rchain/alphanetwork/UNFORGEABLE_NAME_1')
      .then(a => {
        const rholangTerm = JSON.parse(a);
        const jsObject = blockchainUtils.rhoValToJs(rholangTerm);
        registryUri = jsObject.registry_uri;
        lightUnforgeableName = jsObject.unforgeable_name_light[0].gPrivate;
        console.log('lightUnforgeableName is ', lightUnforgeableName);
        console.log('registryUri is ', registryUri);
      })
      .catch(err => {
        console.log(err);
      });
  }

loadUnforgeableName();
