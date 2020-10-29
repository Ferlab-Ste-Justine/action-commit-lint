const childProcess = require('child_process')
const fail = require('./failure')

function runCmd (cmd, label = '', input = null) {
  if (label.length > 0) {
    console.log(label)
  }
  const options = input ? { input } : {}
  const result = childProcess.spawnSync(cmd[0], cmd.slice(1), options)
  if (result.stdout.length > 0) {
    console.log(result.stdout.toString())
  }
  if (result.stderr.length > 0) {
    console.error(result.stderr.toString)
  }

  if (result.status > 0) {
    fail(`Command failed with code ${result.status}`)
  }

  return { stdout: result.stdout, stderr: result.stderr }
}

module.exports = runCmd
