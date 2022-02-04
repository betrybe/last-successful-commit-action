const core = require('@actions/core');
const github = require('@actions/github');

try {
  const octokit = github.getOctokit(core.getInput('githubToken'));
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

  core.getInput('workflowEvent')
  const workflowPayload = {
    owner,
    repo,
    workflow_id: core.getInput('workflowID'),
    status: 'success',
    // branch: core.getInput('branch'),
    event: core.getInput('workflowEvent'),
  }
  octokit.actions
    .listWorkflowRuns(workflowPayload)
    .then((res) => {
      const lastSuccessCommitHash =
        res.data.workflow_runs.length > 0
          ? res.data.workflow_runs[0].head_commit.id
          : '';
      core.setOutput('commitHash', lastSuccessCommitHash);
    })
    .catch((e) => {
      core.setFailed(e.message);
    });
} catch (e) {
  core.setFailed(e.message);
}
