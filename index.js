const childProcess = require('child_process')
const os = require('os')
const process = require('process')

const VERSION = '0_1'

function chooseBinary() {
    const platform = os.platform()
    const arch = os.arch()

    if (platform === 'linux' && arch === 'x64') {
        return `main-linux-amd64-${VERSION}`
    }
    if (platform === 'linux' && arch === 'arm64') {
        return `main-linux-arm64-${VERSION}`
    }

    console.error(`Unsupported platform (${platform}) and architecture (${arch})`)
    process.exit(1)
}

function main() {
    const binary = chooseBinary()
    const mainScript = `${__dirname}/${binary}`
    console.log(`Using file ${binary}`);
    const spawnSyncReturns = childProcess.spawnSync(mainScript, { stdio: 'inherit' });
    const status = spawnSyncReturns.status
    if (typeof status === 'number') {
      console.log(`Failed exit status of ${status}`);  
      process.exit(status);
    }
    process.exit(1);
}

if (require.main === module) {
    main();
}
