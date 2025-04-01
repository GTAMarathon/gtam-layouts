# gtam-layouts
The on-screen graphics used during GTAMarathon.

This bundle has been tested with [NodeCG](https://nodecg.dev) 2.5.3 and [Node.js](https://nodejs.org/en) 22 LTS.

## Installation
Clone the repo **(IMPORTANT! Make sure to clone the submodules too!)**:
```sh
git clone --recurse-submodules https://github.com/GTAMarathon/gtam-layouts
```

Install dependencies *(this step requires the [build tools for node-gyp](https://github.com/nodejs/node-gyp#installation) on Node.js 20+)*:
```sh
npm install
```

And build the layouts:
```sh
npm run build
```
## Usage
To run the layouts, run this command in the bundle's directory:
```sh
npm run start
```

This bundle features very heavy integration with [OBS](https://obsproject.com/). Currently they're not documented in this readme, you'll need to figure it out by reading the config and the code. Sorry about that!

## Configuration
As this README is still WIP, this won't be covered here yet. The `configschema.json` has the layout of the config file, should be easy to figure it out from there.
