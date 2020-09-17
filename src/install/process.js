const { exec } = require('child_process')
const { promisify } = require('util')
const cmd = promisify(exec)

/**
 * Execute bash child process
 * @param {String} command
 * @returns {String}
 */
const execute = async (command) => {
  const { stdout, stderr } = await cmd(command)
  if (stderr) throw Error(stderr)
  console.log(stdout)
  return stdout.trim()
}

module.exports = {
  execute
}
