# Skia Wallet

## Architecture of the software

The code of the wallet is a **layer architecture** (specifically [Domain-Driven Design architecture](https://en.wikipedia.org/wiki/Domain-driven_design) & Clean architecture).

To develop independenly our project, we use the methodology **monorepo** (used in Google, Facebook...). It'll help us to decouple the project and help us scale the project easily. Learn more about monorepos on: [this video by Google](https://youtu.be/W71BTkUbdqE), [Nx.dev](https://nx.dev/guides/why-monorepos).

### Layers

All layers are decoupled. How? Each one is in one or more packages in the folder `packages` of the monorepo:

- **Common**: resources that are used on all projects.
- **Entities**: defines how the data of the others layers will use. It contains *entities* (they're unique because they have a unique id) and *value objects* (they aren't unique).
- **Repositories**: connects to external services (APIs, storage...). The data from external servies will be transformed to the definitions provided by the entities.
- **UI**: presents to the user interface (UI). It depends on the rest of the layers. We can have multiple UI packages (e.g. one for components, one for the wallet...)

Part of the code in the entities is inspired by [Khalil Stemmler](https://khalilstemmler.com/).

## Start programming

### How to manage the monorepo?
To manage the monorepo, we use [Nx by Nrwl](https://nx.dev/). What to consider?

- [How Nx works?](https://nx.dev/using-nx/mental-model)
- Command `@nrwl/workspace` for renaming, moving, removing... the packages. More info [here](https://nx.dev/packages/workspace)
- Command `@nrwl/react` about using the React components. More info [here](https://nx.dev/packages/react)
- Command `@nrwl/next` about using NextJS. More info [here](https://nx.dev/packages/next)

### Set up the project on your computer

1. Install on you computer the latest stable verions of NodeJS. To download it, we recommend to do through the Node Version Manager, or also called [NVM](https://github.com/nvm-sh/nvm).
2. Install the npm package `nx` globally with `npm install -g nx`.
3. Clone this project on you local machine `git clone https://github.com/Future-Wallet/skia-wallet.git`
4. Environment variables
   - (For NodeJS packages) They need to be stored at the root directory in a file called `.env.local` or `.env`. Each variable needs to start with `NIX_XXX_XXX` (e.g. `NX_SDK_APP_ID_TEST`). More info on [nix.dev](https://nx.dev/guides/environment-variables)

### Run npm scripts inside layers

1. Add the command in the package's `package.json`. For example:

```json
"name": "@skiawallet/repositories",
"scripts": {
   "dev": "ts-node src/__dev.ts"
}
```

2. Run this command from the root of the monorepo `nx <your_script> <your_package>` (e.g. `nx dev repositories`)

### Run a single Typescript/Javascript file of a package without committing it

1. Create a file in whenever you want inside your package named `__dev.ts` or `__dev.js` (e.g. the path could be in `/packages/repositories/src/__dev.ts`). It has two underscores.
2. Add a script in the package's `package.json`. For example:

```json
"name": "@skiawallet/repositories",
"scripts": {
   "dev": "ts-node src/__dev.ts"
}
```

3. Run this command from the root of the monorepo `nx <your_script> <your_package>` (e.g. `nx dev repositories`)

> The files called `__dev.ts`, `__dev.tsx`, `__dev.js` or `__dev.jsx`  won't be committed to the git repository, because they're ignored by `.gitignore`.
>
> Alert: the files start with two underscores.

### Run the website

1. (From the root directory) Run locally the wallet `nx run ui-wallet:serve` (you can see `ui-wallet` is the name of one of our packages; you can find the `serve` in the file `project.json` of that package). The console will run NextJS and will show you the localhost URL (e.g `http://localhost:4200`)

## To-Do

- Add a license (take into account that parts of the layer *entities* is copied from the Khalil Stemmler's project [ddd-forum](https://github.com/stemmlerjs/ddd-forum/blob/master/LICENCE.md)).
