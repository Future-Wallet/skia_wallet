# Skia Wallet

## Architecture of the software

The code of the wallet is a layer architecture (specifically [Domain-Driven Design architecture](https://en.wikipedia.org/wiki/Domain-driven_design) & Clean architecture).

### Layers

- **Entities**: defines how the data of the others layers will use. It contains *entities* (they're unique because they have a unique id) and *value objects* (they aren't unique).
- **Repositories**: connects to external services (APIs, storage...). The data from external servies will be transformed to the definitions provided by the entities.
- **Presentation**: presents to the user interface (UI). It depends on the rest of the layers.

Coding inspired by [Khalil Stemmler](https://khalilstemmler.com/).

## To-Do

- Add a license (take into account that parts of the layer *entities* is copied from the Khalil Stemmler's project [ddd-forum](https://github.com/stemmlerjs/ddd-forum/blob/master/LICENCE.md)).
