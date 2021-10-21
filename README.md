# About

Github action to perform commit lint according to the internet convention we agreed upon.

It will scan all the commits up to the last merge, skipping over automation messages.

# Parameters

The script takes the following inputs:

- **commit_msg_regex**: The regex to use to evaluate the commit messages. Defaults to the **semantic commit** standard (minus the support for multi-paragraph bodies and footers, though it could be easily added later on) and in addition to that, you need to include jira-style notation for the ticket (ex: UI-56, CLIN-201, CQDG-63, etc) right after the structural element, but before the commit message.
- **stop_at_commit_msg**: Commit message delimiter that indicates when the tool should stop scanning. Defaults to "Merge pull request #" which is part of the commit message that github puts when we merge pull requests.

# Packaging

Whenever the code for this action is updated, you need to run the **package.sh** script and commit the changed **dist/index.js** file.