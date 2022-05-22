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

To manage the monorepo, we use [Nx by Nrwl](https://nx.dev/). What to consider?

- [How Nx works?](https://nx.dev/using-nx/mental-model)
- Command `@nrwl/workspace` for renaming, moving, removing... the packages. More info [here](https://nx.dev/packages/workspace)
- Command `@nrwl/react` about using the React components. More info [here](https://nx.dev/packages/react)
- Command `@nrwl/next` about using NextJS. More info [here](https://nx.dev/packages/next)

## To-Do

- Add a license (take into account that parts of the layer *entities* is copied from the Khalil Stemmler's project [ddd-forum](https://github.com/stemmlerjs/ddd-forum/blob/master/LICENCE.md)).
