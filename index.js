const core = require('@actions/core');
const github = require('@actions/github');
const { exec } = require('child_process');

try {
  const octokit = github.getOctokit(core.getInput('githubToken'));
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

  const workflowPayload = {
    owner,
    repo,
    workflow_id: core.getInput('workflowID'),
    status: 'success',
    branch: core.getInput('branch'),
    event: core.getInput('workflowEvent')
  }
  octokit.actions
    .listWorkflowRuns(workflowPayload)
    .then(({ data: { workflow_runs }}) => {
      if (workflow_runs.length > 0) {
        core.setOutput('commit_hash', workflow_runs[0].head_commit.id);
      } else {
        exec('git rev-list --max-parents=0 HEAD', function (error, stdout, stderr) {
          if (error) {
            core.setFailed(stderr);
          }
          core.setOutput('commit_hash', '509f7e1dba6c49b3ad31f52473d9262c35d64213');
        });
      }
    })
    .catch((e) => {
      core.setFailed(e.message);
    });
} catch (e) {
  core.setFailed(e.message);
}
