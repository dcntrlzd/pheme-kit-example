var Registry = artifacts.require('./Registry');
var Storage = artifacts.require('./Storage');

module.exports = async (deployer, ...args) => {
  let storage;
  let registry;

  deployer
    .deploy(Storage)
    .then((instance) => {
      storage = instance;
      // Get the deployed instance of B
      return deployer.deploy(Registry, storage.address);
    })
    .then((instance) => {
      registry = instance;
      // Set the new instance of A's address on B via B's setA() function.
      return storage.addOwner(registry.address);
    });
};
