## Contributing

We welcome contributions to the Hyperledger Fabric Project in many forms, and
there's always plenty to do!

Please visit the
[contributors guide](http://hyperledger-fabric.readthedocs.io/en/latest/CONTRIBUTING.html) in the
docs to learn how to make contributions to this exciting project.

## Folder Structure

This repo is structured as a monorepo using [Rush](https://rushjs.io/). Why a monorepo? There are multiple npm modules that are published from this repo, including end to end tests, and tooling. It is siginficant easier to manager within one repo - and Rush has proven to provide excellent support for management of issues such as different depenency versions.

The standard Rush convetions are followed as much as possible, deviation only coming with publishing and broad release version control. This deviation is to fit in 
with the existing Hyperledger Fabric release process - and some of these features in Rush are still evolving. 

### Categories

The following [Rush categories](https://rushjs.io/pages/maintainer/add_to_repo/) are used - and are seen as top level folders

- `apis` contains the `fabric-contract-api` and `fabric-shim-api` modules
- `tools` contains a set of scripts for build tooling (evolved from the `build` folder that existed previoulsy)
- `libraries` contains the `fabric-shim` and `fabric-shim-crypto` modules
- `docker` contains the scripts and dockerfile for the nodeenv image
- `docs` contains the `apidocs` building scripts

### Pre-requisites

* node v10.15.2 (npm v6.4.1) => recommend to use [nvm](https://github.com/nvm-sh/nvm)
* rush => `npm install -g @microsoft/rush`

> Note that npm v6 has some bugs that mean adding new depencies etc are not properly picked up. Longer term we should consider moving to yarn or pnpm. However in practice this isn't a serious problem and has been possible to be worked around by issuing `rm ./common/config/rush/npm-shrinkwrap.json` and then `rush update`

## Using the repo

* Clone the repo, and ensure you are using node10.
* `rush install` to get the main linking setup, and check rush is installed correctly.
* `rush update` is needed to ensure evertyhing is correctly linked and updated.

At this point the repo is fully ready for use and running tests, etc. 

* `rush rebuild` will run the linting, and unit tests across the codebase, as well as building the docker images, and jsdoc API docs
* `rush start-verdaccio` will start verdaccio
* `rush start-fabric` will start the test fabric ready for running FV tests
* `rush test:fv` will run the fv tests, ensure that both the fabric and verdaccio have already been started
* `rush publish --include-all --pack --release-folder ./tarballs --publish`
If you want to get a set of `.tar.gz` files of the node modules to use for local testing this command will put them into the `tarballs` directory
* `rush rebuild --to fvtests` to run the unit tests for the core modules, but not the docker or jsdoc
* `rush rebuild --to fabric-contract-api` to build, lint and run just the `fabric-contract-api` 
* `rush test:fv` to run fv tests across the repos
* `rush test:e2e` to run e2e tests across the repos

## Where are the log files?



## Code of Conduct Guidelines <a name="conduct"></a>

See our [Code of Conduct Guidelines](../blob/master/CODE_OF_CONDUCT.md).

## Maintainers <a name="maintainers"></a>

Should you have any questions or concerns, please reach out to one of the project's [Maintainers](../blob/master/MAINTAINERS.md).

<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.
