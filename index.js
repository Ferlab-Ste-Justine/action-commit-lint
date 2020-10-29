const core = require('@actions/core')
const runCmd = require('./runCmd')

const commitMsgRegex = /[0-9a-z]+[ ](?:\(.+\)[ ])?()/;
function getCommitMessage(line) {
  const result = commitMsgRegex.exec(line)
  return result[1]
}

function cutMsgsAtStopPoint(stopPoint, msgs) {
  const candidates = msgs.filter((msg) => msg.startsWith(stopPoint))
  if(candidates.length > 0) {
    const index = msgs.indexOf(candidates[0])
    return msgs.slice(0, index)
  }
  return msgs;
}

function getCommitMessages(stopPoint) {
  const output = runCmd(['git', 'log', '--oneline'], 'GIT_LOGS')
  const msgs = output.split("\n").map(getCommitMessage)
  return cutMsgsAtStopPoint(stopPoint, msgs)
}

const correctCommitMsgRegex = /[a-z]+: [a-zA-Z0-9_-]\/[a-zA-Z0-9_-]#\d+ .+/;
function validateCommits(msgs, failureFn) {
  msgs.forEach((msg) => {
    if(!msg.match(correctCommitMsgRegex)) {
      failureFn(msg)
    }
  })
}

const stop = core.getInput('stop_at_commit_msg')
const msgs = getCommitMessages(stop)
validateCommits(msgs, (msg) => {
  core.setFailed(`Following commit message doesn't follow the convention: ${msg}`)
})
