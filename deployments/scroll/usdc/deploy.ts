import { Deployed, DeploymentManager } from '../../../plugins/deployment_manager';
import { DeploySpec, deployComet} from '../../../src/deploy';

// const secondsPerDay = 24 * 60 * 60;

// const GOERLI_TIMELOCK = '0x8Fa336EB4bF58Cfc508dEA1B0aeC7336f55B1399';

export default async function deploy(
  deploymentManager: DeploymentManager,
  deploySpec: DeploySpec
): Promise<Deployed> {
  //const trace = deploymentManager.tracer();
  //const ethers = deploymentManager.hre.ethers;

  // Pull in existing assets

  const WETH = await deploymentManager.existing(
    'WETH',
    '0x5300000000000000000000000000000000000004',
    'scroll'
  );

  const l2MessageService = await deploymentManager.existing(
    'l2MessageService',
    '0xBa50f5340FB9F3Bd074bD638c9BE13eCB36E603d',
    'scroll'
  );

  const l2TokenBridge = await deploymentManager.existing(
    'l2TokenBridge',
    '0xaDcA915971A336EA2f5b567e662F5bd74AEf9582',
    'scroll'
  );

  const l2usdcBridge = await deploymentManager.existing(
    'l2usdcBridge',
    '0xaDcA915971A336EA2f5b567e662F5bd74AEf9582',
    'scroll'
  );

  // // Deploy LineaBridgeReceiver check on scroll side
  // const bridgeReceiver = await deploymentManager.deploy(
  //   'bridgeReceiver',
  //   'bridges/linea/LineaBridgeReceiver.sol',
  //   [l2MessageService.address]
  // );

  // // Deploy Local Timelock
  // const localTimelock = await deploymentManager.deploy('timelock', 'vendor/Timelock.sol', [
  //   bridgeReceiver.address, // admin
  //   10 * 60, // delay
  //   14 * secondsPerDay, // grace period
  //   10 * 60, // minimum delay
  //   30 * secondsPerDay // maximum delay
  // ]);

  // // Initialize BridgeReceiver
  // await deploymentManager.idempotent(
  //   async () => !(await bridgeReceiver.initialized()),
  //   async () => {
  //     trace(`Initializing BridgeReceiver`);
  //     await bridgeReceiver.initialize(
  //       GOERLI_TIMELOCK, // govTimelock
  //       localTimelock.address // localTimelock
  //     );
  //     trace(`BridgeReceiver initialized`);
  //   }
  // );

  // Deploy Comet
  const deployed = await deployComet(deploymentManager, deploySpec);
  const { comet } = deployed;

  // Deploy Bulker
  const bulker = await deploymentManager.deploy('bulker', 'bulkers/BaseBulker.sol', [
    await comet.governor(), // admin
    WETH.address // weth
  ]);

  // Deploy fauceteer
  const fauceteer = await deploymentManager.deploy('fauceteer', 'test/Fauceteer.sol', []);

  return {
    ...deployed,
    //bridgeReceiver,
    l2MessageService,
    l2TokenBridge,
    bulker,
    fauceteer,
    l2usdcBridge
  };
}
