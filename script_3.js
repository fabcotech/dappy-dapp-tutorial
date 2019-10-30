let lightUnforgeableName = undefined;
let registryUri = undefined;

const checkLight = () => {
  dappyRChain.fetch('dappy://rchain/alphanetwork/' + lightUnforgeableName)
    .then(a => {
      const rholangTerm = JSON.parse(a);
      if (rholangTerm.exprs[0].g_string === 'on') {
        document.body.setAttribute('style', 'background: #FAFAFA;color:#000;');
        document.body.innerText = 'Light is on !\n\nclick to switch';
      } else {
        document.body.setAttribute('style', 'background: #222;color:#FFF;');
        document.body.innerText = 'Light is off !\n\nclick to switch';
      }
    })
    .catch(err => {
      console.log(err);
    });
}

const loadUnforgeableName = () => {
  dappyRChain.fetch('dappy://rchain/alphanetwork/UNFORGEABLE_NAME_1')
    .then(a => {
      const rholangTerm = JSON.parse(a);
      const jsObject = blockchainUtils.rhoValToJs(rholangTerm);
      registryUri = jsObject.registry_uri;
      lightUnforgeableName = jsObject.unforgeable_name_light[0].gPrivate;
      checkLight();
      setInterval(
        () => {
          checkLight();
        },
        5000
      )
    })
    .catch(err => {
      console.log(err);
    });
}
loadUnforgeableName();