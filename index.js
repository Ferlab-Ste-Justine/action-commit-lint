const core = require('@actions/core')
const runCmd = require('./runCmd')
const fail = require('./failure')

const commitMsgRegex = /[0-9a-z]+[ ](?:\(.+\)[ ])?(.*)/
function getCommitMessage (line) {
  const result = commitMsgRegex.exec(line)
  return result[1]
}

function cutMsgsAtStopPoint (stopPoint, msgs) {
  const candidates = msgs.filter((msg) => msg.startsWith(stopPoint))
  if (candidates.length > 0) {
    const index = msgs.indexOf(candidates[0])
    return msgs.slice(0, index)
  }
  return msgs
}

function getCommitMessages (stopPoint) {
  const output = runCmd(['git', 'log', '--oneline'], 'GIT_LOGS').stdout.toString('utf-8')
  const msgs = output.split('\n').filter((msg) => msg !== '').map(getCommitMessage)
  return cutMsgsAtStopPoint(stopPoint, msgs)
}

const correctCommitMsgRegex = (() => {
  const defaultExp = '(?:[a-z]+(?:\\([a-zA-Z0-9_-]+\\))?!?: [A-Z]{4}-[0-9]+ .+)|(?:Auto-release .+)'
  let exp = ''
  if (core.getInput('commit_msg_regex') !== '') {
    exp = core.getInput('commit_msg_regex')
  } else {
    exp = defaultExp
  }
  core.debug(`Evaluating with regex: ${exp}`)
  return RegExp(exp)
})()

function validateCommits (msgs, failureFn) {
  msgs.forEach((msg) => {
    if (!msg.match(correctCommitMsgRegex)) {
      failureFn(msg)
    }
  })
}

const stop = core.getInput('stop_at_commit_msg')
const msgs = getCommitMessages(stop)
core.debug(`Evaluating commits: \n${msgs.join('\n')}`)

validateCommits(msgs, (msg) => {
  fail(`Following commit message doesn't follow the convention: ${msg}`)
})
