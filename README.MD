**Not up to date for Dappy 0.2.8, will be updated soon**

This repo is a tutorial to help you build cool decentralized web applications with Dappy 🐸.

![Woods](https://images.pexels.com/photos/4827/nature-forest-trees-fog.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=460)

Along this tutorial, we will build a simple web application. It will consist in an interuptor that can be on or off. The dynamic value on/off, as well as all the files will be stored on the blockchain. 🙉🙉🙉

Dappy deals with two kind of content, IP applications and dapps, we are going to build a dapp, read more about dapps [here](https://fabco.gitbook.io/dappy/dapps).

Please download ans install Dappy 0.2.7+ . [dappy.tech/download](https://dappy.tech/download)

**Note :** Up to date with dappy-cli 0.3.5 and Dappy beta release 0.2.7

### Let's start

```
git clone https://github.com/fabcotech/dappy-dapp-tutorial.git
cd dappy-dapp-tutorial
npm i
```

🧐 You must first check the options in the `dappy.config.json`, add `privateKey` (secp256k1 keys), you can ignore `registryUri` and `manifest.fileId` for now. Leave the hosts and ports by default, `observer.testnet.rchain.coop` and `node2.testnet.rchain-dev.tk` are nodes of the RChain testnet. You can change those values to connect to your local node or another node, you must know a validator node and a read-only node. Check [dappy-cli](https://github.com/fabcotech/dappy-cli) documentation for deeper explanations

The tutorial will be divided in n steps, at each step you will be invited to increment the `jsPath` value in `dappy.config.json` (`script_1` for step 1, `script_2` for step 2 etc...).

TODO
Open Dappy browser and make sure it connects to the network : settings / blockchains (`b1.dappy.tech` if you rely on the beta network (there might be other endpoints by now), or `localhost:xxx`) if you rely on a local network.

You can find a guide to connect to or set up a network here https://fabco.gitbook.io/dappy/ .

### Step 1

in this first step, we will simply push a static web application the blockchain. Our web application is composed of `script_1.js` `style.css` and `index.html`. The `index.html` displays "Dapp loaded !" because we don't know yet if the interruptor is on or off.

```
npm run dappy:push
```

You should just see the "Dapp loaded !" text 👌.

Each time you run this scripts, it bundles your application together in a html file, encodes it to base64 and also adds a signature so the client can verify the file. The file that will be sent on chain is a `.dpy` file, you can see in the logs that a `.dpy` has been created and weights ~0.8ko.

If you encounter some error when pushing, make sure the rnode instances at `readOnlyHost` and `validatorHost` in `dappy.config.json` are running (`:40403/status` path tells you about the status of the rnode). Also check that your private key has enough funds, and that phlo limit is not superior to that.

Find the line `address :` log, this value is the blockchain address of the web application. You can now just paste it in the Dappy browser search bar and hit enter. You should have the web application loaded in the browser, with the **DA** label telling you it is a decentralized app (dapp). You can click on the **DA** to get network information.

If you encounter some error when loading in dappy browser, also check the network/resolver settings in Dappy and make sure you are connected to enough nodes. If you have only one endpoint, set the resolver settings to 1 / 100%.

**Any issue** : share it with us at [https://discord.gg/8Cu5UFV](https://discord.gg/8Cu5UFV).

You just deployed your first full dapp with Dappy, congratulations ! 🥳🥳

You can activate the _Development mode_ in the settings to have the chrome devtool popping up when the application loads.

### Step 2

- `dappy.config.json` : `script_1.js` -> `script_2.js`

Dappy CLI `dappy:push` uses the [files module](https://github.com/fabcotech/rholang-files-module) for handling files on the blockchain.

The uploads goes into 2 steps :

- Step 1, a files module with no file in it is deployed, and the registry URIs are recovered. See [rholang files module](https://github.com/fabcotech/rholang-files-module#files-module) to understand what is being deployed and recovered.
- Step 2, if `REGISTRY_URI` is found in the js, css or html files, it is replaced with proper value from step 1. Then the file is compiled into a .dpy, and uploaded with `manifest.fileId` as file ID. EXPLIQUER

```
npm run dappy:push
```

If you have activated the _Development mode_, you should have something like the following logged in the console of the dappy app:

```
filesRegistryUri is xxx"
entryRegistryUri is xxx"
currentNonceValue is xxx"
```

The first js file was all empty. Take a look at the file `script_2.js`, it contains the `REGISTRY_URI` expression that will be replaced by dappy CLI. `dappyRChain.fetch("dappy://rchain/betanetwork/aaa")` when executed will get the description of the files module, that contains the files module registry URI itself ("aaa"), the entry registry URI, the value of the nonce, and the list of files. We will use those values in further steps.

**Note** : The files registry URI in the description of the files module will be called simply registry URI, it must not be mismatched with the entry registry URI.

**Note** : `dappyRChain.fetch("dappy://rchain/betanetwork/REGISTRY_URI")` is not the same as `dappyRChain.fetch("dappy://rchain/betanetwork/REGSTRY_URI.FILE_ID")`, the first one gets the variables and URIs of the files module, the second one gets the `index` file for this files module.

The `index` file ID is where our dapp is stored, we will create a `light` file where we store on/off value.

When doing `dappyRChain.fetch`, the network settings defined by the user are the ones that matter and you have no power over it. At your level (web app developer) it simply succeeds or fail. For example if the settings for dappy on the beta network are 2 / 100%. Each time you do a `dappyRChain.fetch` call, two nodes will be queried (b1.dappy.tech and b2.dappy.tech), and Dappy checks that both responses are the same before trasnmitting the result to the web application.

### Step 3

- `dappy.config.json` : `script_2.js` -> `script_3.js`
- `dappy.config.json` : `index.html` -> `index_2.html`

Check the `script_3.js` file, we will basically deploy the same thing, but also a function `checkLight` that does a `dappyRChain.fetch` to get the on/off value, and then changes the color of the body.

The `checkLight` function is called every 5 seconds. It will go through te Dappy multi-request mechanism. That value will be updated in the UI **when the user's network constraint ar satisfied**, for example if he has settings to 8 (connected to 8 nodes) / 100%. The value will be updated in your web application when all the 8 nodes agree on the "file" value, in our case the file is a simple string that can be on or off.

```
npm run dappy:push
```

So now you should have the _Light is off_ text in the body. It means that the file `.light` does not exist, or that it is off.

### Step 4

- `dappy.config.json` : `script_3.js` -> `script_4.js`

The `dappyRChain.fetch` function allows you to read from the blockchain, now how should we write / set some value on chain ? Dappy also exposes a `dappyRChain.transaction` function allowing you to deploy any arbitrary rholang code, and have the user requested to sign it (he can refuse or accept).

So the `script_4.js` simply listens for click on the body `document.body.addEventListener('click'`, and deploys a RChain transaction to update the value on the private channel that is exposed through the `entryRegistryUri` entry point.

The `"signature": "SIGN"` is important, the value SIGN will be replaced by a signature of the string `currentNonceValue` that we send to Dappy. We cannot do this in the JS because we have no right to manipulate private key, dappy will do it for us.

This signature is necessary for the files module to authentify us (rholang), you could eventually deploy another versio of the files module that does not check signature, anyone could be able to switch the light 😩😩.

```
npm run dappy:push
```

Now simply click on the body, fill the inputs with correct values, and wait a bit (it can be several minutes on current testnet), the body's color should change.

You can stop the tab, or reload it.

### That's it

This tutorial is over. You can share the blockchain address with anyone connected to the same dappy network.

This architecture does not need any server or third party service to exist, it is strictly relying on the blockchain platform and the Dappy network that is referenced in Dappy browser (the Dappy network is a subset of the blockchain platform).

### Going further

Other features are available:

- `dappyRChain.identify()`
- `dappyRChain.sendPaymentRequest()`
- Name system

Read https://fabco.gitbook.io/dappy/
