This repo is a tutorial to help you build cool decentralized web applications with Dappy.

Along this tutorial, we will build a simple web application. It will consist in an interuptor that can be on or off. The dynamic value ON / OFF, as well as all the files will be stored on the blockchain.

### Let's start

```
git clone https://github.com/fabcotech/dappy-dapp-tutorial.git
cd dappy-dapp-tutorial
npm i
```

You need Dappy 0.2.5+ installed on your computer.

You must first check the options in the `dappy.config.json`, add `public_key` and `private_key` (secp256k1 keys), you can ignore `registry_uri` and `unforgeable_name_id` for now. End point is by default `a1.dappy.tech`, you can also change it to connect to your local node.

The tutorial will be divided in n steps, at each step you will be invited to increment the `jsPath` value in `dappy.config.json` (`script_1` for step 1, `script_2` for step 2 etc...).

#### Step 1

in this first step, we will simply push a static web application on chain. Our web application is composed of `script_1.js` `style.css` and `index.html`.

```
npm run dappy:push
```

You can see in the logs that a `.dpy` has been created and weights ~0.8ko.

If you encounter some error, make sure the Dappy browser is connected to the same network as the rnode instance running at `host` in `dappy.config.json` config file.

Among the logs, you should have a `unforgeable_name_id :` log, this value is the blockchain address of the web application. You can now just paste it in the Dappy browser search bar. You should have the web application loaded in the browser, with the **DA** label telling you it is a decentralized app.

You just deployed your first full dapp with Dappy, congratulations !

You can activate the *Development mode* in the settings to have the chrome devtool popping up when the application loads.

#### Step 2

In the step 1, the logs told us that the rholang (backend) file is a default one, which does not include some storage functionality except for the file. We want to change that because our web app needs to get and set a value on the blockchain.

Rename the `push.rho.example` file to `push.rho` and have a look at it. This file will override the default `push.rho` file from `dappy-cli`. The `basket` includes an additional key which is `unforgeable_name_light`, this is where we will store the on/off value on chain. It also exposes the `toggleLightUriCh` channel so we can change the value. So it is basically a get / set rholang contract.

`dappy.config.json` : `script_1.js` -> `script_2.js`

the first js file was all empty. Take a look at the second JS file. The key thing is that `dappy-cli` will override the `UNFORGEABLE_NAME_1` string with the unforgeable name id of the `basket` unforgeable name. Our web application retreives this `basket` with `dappyRChain.fetch`.

```
npm run dappy:push
# load "unforgeable_name_id" in Dappy browser
```

If you have activated the *Development mode*, you should have something like the following logged in the console:
```
lightUnforgeableName is  dac39ec15a3cf70d5bfd79eadfb948201a499338140d5b4910ef7ff812d518b1
registryUri is  rho:id:nbi4qduztsm7bg4yo48mqgkg13xjknwmeuptxfc7smmt6dhjinyhm4
```

Very cool ! We have all the references we need to update the value and read it.

`dappyRChain.fetch` is a function exposed in the global javascript context by Dappy. It allows you to request for an unforgeable name. As you see you do not have to worry about network / servers etc... The network settings defined by the user are the ones that matter and you have no power over it. At your level (web app developer) it simply succeeds or fail. For example the default settings for dappy on the alpha-network is 2 / 100%. Each time you do a `dappyRChain.fetch` call, two nodes are queried (a1.dappy.tech and a2.dappy.tech), and Dappy checks that both responses are the same before trasnmitting the result to the web application.

#### Step 3

`dappy.config.json` : `script_2.js` -> `script_3.js`
`dappy.config.json` : `index.html` -> `index_3.html`

Check the `script_3.js` file, we will basically deploy the same thing, but also a function `checkLight` that does a `dappyRChain.fetch` to get the ON / OFF value, and then changes the color of the body.

The `checkLight` function is called every 5 seconds. It will go through te Dappy multi-request mechanism.  That value will be updated in the UI **when the user's network constraint ar satisfied**, for example if he has settings to 8 (connected to 8 nodes) / 100%. The value will be updated in your web application when all the 8 nodes agree on the unforgeable name's value.

```
npm run dappy:push
# load "unforgeable_name_id" in Dappy browser
```

So now you should have the *Light is on !* text in the body. It means that the value has been retreived on chain, and that it is ON.

#### Step 4

`dappy.config.json` : `script_3.js` -> `script_4.js`

The `dappyRChain.fetch` function allows you to read from the blockchain, now how should we write / set some value on chain ? Dappy also exposes a `dappyRChain.transaction` function allowing you to deploy any arbitrary rholang code, and have the user requested to sign it (he can refuse or accept).

So the `script_4.js` simply listens for click on the body `document.body.addEventListener('click'`, and deploys a RChain transaction to update the value on the private channel that is exposed through the `registryUri` entry point.

```
npm run dappy:push
# load "unforgeable_name_id" in Dappy browser
```

Now simply click on the body, fill the inputs with correct values, and wait a bit, the body's color should change.

This tutorial is over. You can share the blockchain address with anyone connected to the same dappy network, since we have not coded any permission related code, anyone can change the value as well.

This architecture does not need any server or third party service to leave, it is strictly dependand on the blockchain platform and the Dappy network that is referenced in Dappy browser (the Dappy network is a subset of the blockchain platform).