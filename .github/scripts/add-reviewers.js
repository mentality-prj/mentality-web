// @ts-nocheck
const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs')
const yaml = require('js-yaml')

function loadReviewers() {
  try {
    const fileContents = fs.readFileSync('.github/reviewers.yml', 'utf8')
    const data = yaml.load(fileContents)
    if (!data.reviewers || !Array.isArray(data.reviewers)) {
      core.setFailed('Invalid or missing reviewers in reviewers.yml.')
      return []
    }
    return data.reviewers
  } catch (error) {
    core.setFailed(`Error reading reviewers.yml: ${error.message}`)
    return []
  }
}

async function run() {
  try {
    const reviewers = loadReviewers()

    const removeRequest = core.getInput('remove').toLowerCase() === 'true'
    const token = core.getInput('token') || process.env.GITHUB_TOKEN

    // Initialize octokit with the token
    const octokit = github.getOctokit(token)
    const context = github.context

    if (!context.payload.pull_request) {
      core.setFailed('No pull request found.')
      return
    }

    const pullRequestNumber = context.payload.pull_request.number
    // Author of the PR
    const author = context.payload.pull_request.user.login
    const repoOwner = context.repo.owner
    const repoName = context.repo.repo

    // Exclude the PR author from the list of reviewers
    const filteredReviewers = reviewers.filter((reviewer) => reviewer !== author)

    // If there are no reviewers to assign because all reviewers are the PR author, exit
    if (filteredReviewers.length === 0) {
      core.info('No reviewers to assign, as all reviewers are the PR author.')
      return
    }

    // Parameters for the reviewers request
    const params = {
      owner: repoOwner,
      repo: repoName,
      pull_number: pullRequestNumber,
      reviewers: filteredReviewers,
    }

    if (removeRequest) {
      await octokit.rest.pulls.removeRequestedReviewers(params)
    } else {
      await octokit.rest.pulls.requestReviewers(params)
    }

    core.info(`Reviewers ${removeRequest ? 'removed' : 'added'}: ${reviewers}`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
