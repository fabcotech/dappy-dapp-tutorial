This repo is a tutorial to help you build cool decentralized web applications with Dappy 🐸.

![Woods](https://images.pexels.com/photos/4827/nature-forest-trees-fog.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=460)

Along this tutorial, we will build a simple web application. It will consist in an interuptor that can be on or off. The dynamic value on/off, as well as all the files will be stored on the blockchain. 🙉🙉🙉

Dappy deals with two kind of content, IP applications and dapps, we are going to build a dapp, read more about dapps [here](https://fabco.gitbook.io/dappy/dapps).

Please download ans install dappy browser 0.3.5+ . [dappy.tech/download](https://dappy.tech/download)

**Note :** Up to date with dappy-cli 0.4.4 and Dappy beta release 0.3.5

### Let's start

```
git clone https://github.com/fabcotech/dappy-dapp-tutorial.git
cd dappy-dapp-tutorial
npm i
```

🧐 You must first check the options in the `dappy.config.json`, add `privateKey`, you can ignore `registryUri` and `manifest.fileId` for now. Leave the hosts and ports by default, `observer.testnet.rchain.coop` and `node2.testnet.rchain-dev.tk` are nodes of the RChain testnet. You can change those values to connect to your local node or another node, you must know a validator node and a read-only node. Check [dappy-cli](https://github.com/fabcotech/dappy-cli) documentation for deeper explanations

The tutorial will be divided in n steps, at each step please increment the `jsPath` value in `dappy.config.json` (`script_1` for step 1, `script_2` for step 2 etc...).

The default values in `dappy.config.json` are for the dappy delta network, connected to the RChain testnet.

Please configure dappy browser to connect to the right network (delta network (testnet) by default). See [general documentation](https://fabco.gitbook.io/dappy/dappy-browser).

### Step 1

- `dappy.config.json jsPath` : `script_1.js`
- `dappy.config.json htmlPath` : `index_1.html`

In this first step, we will simply push a static web application the blockchain. The web application is composed of `script_1.js` `style.css` and `index_1.html`. The `index_1.html` displays "Dapp loaded !".

```
npm run dappy:push
```

If you encounter some error when pushing, make sure the rnode instances at `readOnlyHost` and `validatorHost` in `dappy.config.json` are running (`node2.testnet.rchain-dev.tk/status` path tells you about the status of the rnode instance on testnet). Also check that your private key has enough funds, and that phlo limit is not superior to that.

Find the line `address :` log, this value is the blockchain address of the web application. You can now just copy and paste it in the dappy browser search bar and hit enter. You should have the web application loaded in the browser, with the **DA** label telling you it is a decentralized app (dapp). You can click on the **DA** to get network information.

You should just see the "Dapp loaded !" text 👌.

If you encounter some error when loading in dappy browser, also check the network/resolver settings in Dappy and make sure you are connected to enough nodes. If you have only one endpoint, set the resolver settings to _1 / 100%_.

**Any issue** : share it with us at [https://discord.gg/8Cu5UFV](https://discord.gg/8Cu5UFV).

You just deployed your first full dapp with Dappy, congratulations ! 🥳🥳

Make sure you turned on the _Development mode_ in dappy browser's settings.

#### About Dappy CLI and the rchain-token

Dappy CLI command `dappy:push` deploys a new instance of rchain-token, and creates a bag, this bag will represent a file, see [rchain-token#files](https://github.com/fabcotech/rchain-token/tree/files). In the case of our application, bag = file.

The upload (`dappy:push`) goes into 2 steps :

- Step A, an empty rchain-token contract is deployed.
- Step B, if `REGISTRY_URI`, or `FULL_ADDRESS` strings are found in the html or javascript, values are replaced. Then the file is compiled into a .dpy, and uploaded in the rchain-token contract as a data associated to bag `index`.

The registry URI is the address of the rchain-token contract, we use bags (see rchain-token#files) to represent files, each bag represents one file. The bag ID will be the `manifest.fileId` in `dappy.config.json`, `index` by default.

In order to avoid re-deploying an entire rchain-token contract each time (step A), you can simply update the file at each step. Get the registry URI from the logs, and put it in the proper place in `dappy.config.json`. Then just run `npm run dappy:update` instead of `npm run dappy:push`.

### Step 2

- `dappy.config.json jsPath` : `script_2.js`
- `dappy.config.json htmlPath` : `index_1.html`

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

The first javascript file is empty. Take a look at the file `script_2.js`, it contains a `REGISTRY_URI` expression, dappy CLI will replace this by the actual registry URI. `dappyRChain.fetch("dappy://REGISTRY_URI")` when executed will get the rchain-token contract values (nonce, registry URI, public key etc.), this description contains the following keys:

- `.registryUri`: the registry URI of the contract (rchain-token#files contract)
- `.nonce`: the value of the nonce that changes everytime an aciton is performed
- `.locked`: this value is only used for real tokens, see [rchain-token#files](https://github.com/fabcotech/rchain-token/tree/files).

We will use those values in further steps.

**Note** : `dappyRChain.fetch("dappy://REGISTRY_URI")` is not the same as `dappyRChain.fetch("dappy://REGSTRY_URI.FILE_ID")`, the first one gets the rchain-token contract values, the second one gets the data associated with bag `index`.

**Note 2** : If you know the dappy network you will work with, you can write complete dappy address : `dappyRChain.fetch("dappy://NETWORK/REGISTRY_URI")`. Keeping the shortcut notation `dappyRChain.fetch("dappy://REGISTRY_URI")` is simpler though, because you don't need to think about which network you are working with, the browser will resolve it automatically.

So basically we have a rchain-token contract, with one bag with `index` as ID, the data associated with this bag is our html application. We will create a second bag, this time we will only attach a on/off value to it as data.

#### About multi-requests

When doing `dappyRChain.fetch`, the network settings defined by the user are the ones that matter and you have no power over it. At your level (web app developer) it simply succeeds or fail. For example if the settings for dappy on the beta network are 2 / 100%. Each time you do a `dappyRChain.fetch` call, two nodes will be queried (b1.dappy.tech and b2.dappy.tech), and Dappy checks that both responses are the same before trasnmitting the result to the web application.

### Step 3

- `dappy.config.json jsPath` : `script_3.js`
- `dappy.config.json htmlPath` : `index_2.html`

Check the `script_3.js` file, we will basically deploy the same thing, but also a function `checkLight` that does a `dappyRChain.fetch` to get the on/off value, and then changes the color of the body.

The `checkLight` function is called every 5 seconds. It will go through te Dappy multi-request mechanism. That value will be updated in the UI **when the user's network constraint are satisfied**, for example if he has settings to 8 (connected to 8 nodes) / 100%. The value will be updated in your web application when all the 8 nodes agree on the value of the file with ID "light", in our case the file is a simple string that can be on or off.

```
npm run dappy:push
# or
npm run dappy:update
```

So now you should have the _Light is off_ text in the body. It means that there is no bags with ID `light` in the rchain-token contract, it can also mean that the data associated with this bag is string "off".

### Step 4

- `dappy.config.json jsPath` : `script_4.js`
- `dappy.config.json htmlPath` : `index_2.html`

The `dappyRChain.fetch` function allows you to read from the blockchain, now how should we write / set some value on chain ? Dappy also exposes a `dappyRChain.transaction` function allowing you to deploy any arbitrary rholang code, and have the user requested to sign it (he can refuse or accept).

The `script_4.js` listens for click events on the body `document.body.addEventListener('click'`, and deploys a RChain transaction. In the context of our application, a bag is synonym to a file. The transaction will update the data associated with bag `light` if this bag exists, or create this bag with the `create-tokens` method, see [rchain-token#files](https://github.com/fabcotech/rchain-token/tree/files).

The `"signature": "SIGN"` (script_4.js) is important, the value SIGN will be replaced by a signature of the payload, that we send to dappy browser as a hexadecimal string. We cannot do this in the JS because we have no right to manipulate private key, dappy will do it for us.

This signature is necessary for the rchain-token contract (rholang) to authentify us.

```
npm run dappy:push
# or
npm run dappy:update
```

Now simply click on the body, fill the inputs with correct values, and wait a bit (it can be several minutes on current testnet), the body's color should change.

You can stop the tab, or reload it.

### That's it

This tutorial is over. You can share the blockchain address with anyone connected to the same dappy network.

This architecture does not need any server or third party service to exist, it is strictly relying on the blockchain platform and the Dappy network that is referenced in dappy browser (the Dappy network is a subset of the blockchain platform).

### Going further

Other features are available:

- `dappyRChain.identify()`
- `dappyRChain.sendPaymentRequest()`
- Name system

Read https://fabco.gitbook.io/dappy/
