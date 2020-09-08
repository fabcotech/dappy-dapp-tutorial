This repo is a tutorial to help you build cool decentralized web applications with Dappy 🐸.

![Woods](https://images.pexels.com/photos/4827/nature-forest-trees-fog.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=460)

Along this tutorial, we will build a simple web application. It will consist in an interuptor that can be on or off. The dynamic value on/off, as well as all the files will be stored on the blockchain. 🙉🙉🙉

Dappy deals with two kind of content, IP applications and dapps, we are going to build a dapp, read more about dapps [here](https://fabco.gitbook.io/dappy/dapps).

Please download ans install Dappy 0.3.3+ . [dappy.tech/download](https://dappy.tech/download)

**Note :** Up to date with dappy-cli 0.4.2 and Dappy beta release 0.3.3

### Let's start

```
git clone https://github.com/fabcotech/dappy-dapp-tutorial.git
cd dappy-dapp-tutorial
npm i
```

🧐 You must first check the options in the `dappy.config.json`, add `privateKey` (secp256k1 keys), you can ignore `registryUri` and `manifest.fileId` for now. Leave the hosts and ports by default, `observer.testnet.rchain.coop` and `node2.testnet.rchain-dev.tk` are nodes of the RChain testnet. You can change those values to connect to your local node or another node, you must know a validator node and a read-only node. Check [dappy-cli](https://github.com/fabcotech/dappy-cli) documentation for deeper explanations

The tutorial will be divided in n steps, at each step please increment the `jsPath` value in `dappy.config.json` (`script_1` for step 1, `script_2` for step 2 etc...).

The default values in `dappy.config.json` are for the dappy delta network, connected to the RChain testnet.

Please configure Dappy browser to connect to the right network (delta network (testnet) by default). See [general documentation](https://fabco.gitbook.io/dappy/dappy-browser).

### Step 1

In this first step, we will simply push a static web application the blockchain. Our web application is composed of `script_1.js` `style.css` and `index_1.html`. The `index_1.html` displays "Dapp loaded !" because we don't know yet if the interruptor is on or off.

```
npm run dappy:push
```

If you encounter some error when pushing, make sure the rnode instances at `readOnlyHost` and `validatorHost` in `dappy.config.json` are running (`node2.testnet.rchain-dev.tk/status` path tells you about the status of the rnode). Also check that your private key has enough funds, and that phlo limit is not superior to that.

Find the line `address :` log, this value is the blockchain address of the web application. You can now just paste it in the Dappy browser search bar and hit enter. You should have the web application loaded in the browser, with the **DA** label telling you it is a decentralized app (dapp). You can click on the **DA** to get network information.

You should just see the "Dapp loaded !" text 👌.

If you encounter some error when loading in dappy browser, also check the network/resolver settings in Dappy and make sure you are connected to enough nodes. If you have only one endpoint, set the resolver settings to 1 / 100%.

**Any issue** : share it with us at [https://discord.gg/8Cu5UFV](https://discord.gg/8Cu5UFV).

You just deployed your first full dapp with Dappy, congratulations ! 🥳🥳

You can activate the _Development mode_ in the settings to have the chrome devtool popping up when the application loads.

#### About Dappy CLI and the files module

Dappy CLI command `dappy:push` uses the [files module](https://github.com/fabcotech/rholang-files-module) for handling files on the blockchain.

The uploads (`dappy:push`) goes into 2 steps :

- Step A, a files module with no file in it is deployed, and the registry URIs are recovered. See [rholang files module](https://github.com/fabcotech/rholang-files-module#files-module) to understand what is being deployed and recovered.
- Step B, if `REGISTRY_URI` is found in the javascript, css or html files, it is replaced with proper value from step 1. Then the file is compiled into a .dpy, and uploaded to the blockchain.

The `registryUri` is the address of the files module, there is a unique file ID for each file stored in this files module. If you did not touch `manifest.fileId` in `dappy.config.json`, the value is "index".

In order to avoid re-deploying an entire files module each time (step A), you can simply update the file at each step. Get the registry URI from the logs, and put it in the proper place in `dappy.config.json`. Then just run `npm run dappy:update` instead of `npm run dappy:push`.

### Step 2

- `dappy.config.json` : `script_1.js` -> `script_2.js`

```
npm run dappy:push
# or
npm run dappy:update
```

If you have activated the _Development mode_, you should have something like the following logged in the console of the dappy app:

```
registryUri is xxx"
currentNonceValue is xxx"
```

The first javascript file is empty. Take a look at the file `script_2.js`, it contains a `REGISTRY_URI` expression, dappy CLI will replace this by the actual registry URI. `dappyRChain.fetch("dappy://REGISTRY_URI")` when executed will get the description of the files module, this description contains the following keys:

- `.registryUri`: the files module registry URI itself
- `.nonce`: the value of the nonce that changes everytime an aciton is performed
- `.files`: the list of files.

We will use those values in further steps.

**Note** : `dappyRChain.fetch("dappy://REGISTRY_URI")` is not the same as `dappyRChain.fetch("dappy://REGSTRY_URI.FILE_ID")`, the first one gets the description of the files module, the second one gets the `index` file for this files module.

**Note 2** : If you know the dappy network you will work with, you can write complete dappy address : `dappyRChain.fetch("dappy://NETWORK/REGISTRY_URI")`. Keeping the shortcut notation `dappyRChain.fetch("dappy://REGISTRY_URI")` is simpler though, because you don't need to think about which network you are working with, the browser will resolve it automatically.

The `index` file ID is where our dapp is stored, in the same file smodule, we will create a file with file ID "light", this file will contain the on/off value.

#### About multi-requests

When doing `dappyRChain.fetch`, the network settings defined by the user are the ones that matter and you have no power over it. At your level (web app developer) it simply succeeds or fail. For example if the settings for dappy on the beta network are 2 / 100%. Each time you do a `dappyRChain.fetch` call, two nodes will be queried (b1.dappy.tech and b2.dappy.tech), and Dappy checks that both responses are the same before trasnmitting the result to the web application.

### Step 3

- `dappy.config.json` : `script_2.js` -> `script_3.js`
- `dappy.config.json` : `index_1.html` -> `index_2.html`

Check the `script_3.js` file, we will basically deploy the same thing, but also a function `checkLight` that does a `dappyRChain.fetch` to get the on/off value, and then changes the color of the body.

The `checkLight` function is called every 5 seconds. It will go through te Dappy multi-request mechanism. That value will be updated in the UI **when the user's network constraint are satisfied**, for example if he has settings to 8 (connected to 8 nodes) / 100%. The value will be updated in your web application when all the 8 nodes agree on the value of the file with ID "light", in our case the file is a simple string that can be on or off.

```
npm run dappy:push
# or
npm run dappy:update
```

So now you should have the _Light is off_ text in the body. It means that the file "light" does not exist in our files module, or that it is off.

### Step 4

- `dappy.config.json` : `script_3.js` -> `script_4.js`

The `dappyRChain.fetch` function allows you to read from the blockchain, now how should we write / set some value on chain ? Dappy also exposes a `dappyRChain.transaction` function allowing you to deploy any arbitrary rholang code, and have the user requested to sign it (he can refuse or accept).

The `script_4.js` listens for click events on the body `document.body.addEventListener('click'`, and deploys a RChain transaction to update the value on the private channel that is exposed through the `registryUri` registry (see rholang documentation if you want to know how the registry, and channel references work).

The `"signature": "SIGN"` (script_4.js) is important, the value SIGN will be replaced by a signature of the string `currentNonceValue` that we send to Dappy browser. We cannot do this in the JS because we have no right to manipulate private key, dappy will do it for us.

This signature is necessary for the files module to authentify us (rholang), you could eventually deploy another version of the files module that does not check signature, anyone could be able to switch the light 😩😩.

```
npm run dappy:push
# or
npm run dappy:update
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
