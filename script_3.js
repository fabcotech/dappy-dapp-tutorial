let registryUri = undefined;
let currentLightValue = undefined;
let currentNonceValue = undefined;
let publicKey = undefined;

if (typeof dappyRChain !== "undefined") {
  const checkLight = () => {
    dappyRChain
      .fetch("dappy://" + registryUri + ".light")
      .then((a) => {
        const rholangTerm = JSON.parse(a).expr[0];
        if (!rholangTerm) {
          document.body.setAttribute("style", "background: #222;color:#FFF;");
          document.body.innerText = "Light is off\n\nclick to switch";
          return;
        }
        const jsValue = blockchainUtils.rhoValToJs(rholangTerm);
        if (jsValue === "on") {
          currentLightValue = "on";
          document.body.setAttribute(
            "style",
            "background: #FAFAFA;color:#000;"
          );
          document.body.innerText = "Light is on\n\nclick to switch";
        } else {
          currentLightValue = "off";
          document.body.setAttribute("style", "background: #222;color:#FFF;");
          document.body.innerText = "Light is off\n\nclick to switch";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
      checkLight();
      setInterval(checkLight, 5000);
    })
    .catch((err) => {
      console.log(err);
    });
}
