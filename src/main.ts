import { inspect } from 'node:util';
import * as core from '@actions/core';
import * as github from '@actions/github';
import { getOctokit } from '@amezin/js-actions-octokit';

async function main() {
    const octokit = getOctokit(
        core.getInput('github-token', { required: true })
    );

    await octokit.rest.repos.get({
        ...github.context.repo,
    });
}

main().catch((error: unknown) => {
    core.setFailed(String(error));
    core.debug(inspect(error));
});
