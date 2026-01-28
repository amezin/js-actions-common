import { inspect } from 'node:util';
import * as core from '@actions/core';
import * as github from '@actions/github';
import { getOctokit } from '@amezin/js-actions-octokit';

async function main() {
    const octokit = getOctokit(
        core.getInput('github-token', { required: true })
    );

    const { data: repo } = await octokit.rest.repos.get({
        ...github.context.repo,
    });

    const branches = await octokit.paginate(octokit.rest.repos.listBranches, {
        ...github.context.repo,
    });

    const filteredBranches = branches.filter(
        branch => branch.name === repo.default_branch
    );

    if (filteredBranches.length === 0) {
        throw new Error(`Branch ${repo.default_branch} not found`);
    }

    if (filteredBranches.length > 1) {
        throw new Error(`Multiple ${repo.default_branch} branches found`);
    }
}

main().catch((error: unknown) => {
    core.setFailed(String(error));
    core.debug(inspect(error));
});
