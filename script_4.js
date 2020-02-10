let lightUnforgeableName = undefined;
let registryUri = undefined;

document.body.addEventListener("click", () => {
  dappyRChain
    .transaction({
      term: `new updateCh, lookup(\`rho:registry:lookup\`) in {
        lookup!(\`${registryUri}\`, *updateCh) |
        for(update <- updateCh) {
          update!("UPDATE")
        }
      }`
    })
    .then(res => {
      console.log("transaction aired successfully");
      console.log(res);
    })
    .catch(err => {
      console.log("transaction error");
      console.log(err);
    });
});

const checkLight = () => {
  dappyRChain
    .fetch("dappy://rchain/alphanetwork/" + lightUnforgeableName)
    .then(a => {
      const response = JSON.parse(a);
      const rholangTerm = response.expr;
      const jsValue = blockchainUtils.rhoValToJs(rholangTerm);
      console.log("lightUnforgeableName : ", jsValue);
      if (jsValue === "on") {
        document.body.setAttribute("style", "background: #FAFAFA;color:#000;");
        document.body.innerText = "Light is on !\n\nclick to switch";
      } else {
        document.body.setAttribute("style", "background: #222;color:#FFF;");
        document.body.innerText = "Light is off !\n\nclick to switch";
      }
    })
    .catch(err => {
      console.log(err);
    });
};

const loadUnforgeableName = () => {
  dappyRChain
    .fetch("dappy://rchain/alphanetwork/UNFORGEABLE_NAME_1")
    .then(a => {
      const response = JSON.parse(a);
      const rholangTerm = response.expr;
      const jsObject = blockchainUtils.rhoValToJs(rholangTerm);
      registryUri = jsObject.registry_uri;
      lightUnforgeableName = jsObject.unforgeable_name_light.UnforgPrivate;
      checkLight();
      setInterval(() => {
        checkLight();
      }, 5000);
    })
    .catch(err => {
      console.log(err);
    });
};
loadUnforgeableName();
