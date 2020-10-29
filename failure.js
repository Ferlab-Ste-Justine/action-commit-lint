const core = require('@actions/core')

function fail(msg) {
    core.setFailed(msg)
}

module.exports = fail