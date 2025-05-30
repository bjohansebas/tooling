import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
    auth: 'token', // should have repo and repo:public_repo scope
});

// Set the organization name, label name, color, and description
const label = {
    name: 'doc',
    new_name: 'docs',
    color: 'ff0000',
    description: 'Documentations issues',
}
const orgName = 'expressjs';

export async function createLabelInRepo(label, owner, repo) {
    try {
        await octokit.issues.updateLabel({
            owner,
            repo,
            ...label
        });
        console.log(`Label '${label.name}' was updated to '${label.new_name}' to ${repo}`);
    } catch (error) {
        console.log(error)
        if (error.status === 422) {
            console.log(`Label '${label.new_name}' already exists in ${repo}`);
        } else {
            console.error(
                `Failed to create label in ${repo}: ${error.message}`
            );
        }
    }
}

async function createLabelInAllRepos() {
    try {
        const repos = await octokit.paginate(octokit.repos.listForOrg, {
            org: orgName,
        });

        for (const repo of repos) {
            await createLabelInRepo(label, orgName, repo.name);
        }

        console.log('Label creation completed.');
    } catch (error) {
        console.error(
            `Error fetching repositories or creating labels: ${error.message}`
        );
        process.exit(1);
    }
}

createLabelInAllRepos();