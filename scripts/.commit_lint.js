#!/usr/bin/env node

/**
 * Validate if the commit message follows the commits guide https://github.com/Future-Wallet/skia-wallet/wiki/Commits
 *
 * Inspired by Nx's repository https://github.com/nrwl/nx/blob/master/scripts/commit-lint.js
 */

const { types, scopes } = require('./.commit_config.js');

console.log('🐟🐟🐟 Validating git commit message 🐟🐟🐟');
const gitMessage = require('child_process')
  .execSync('git log -1 --no-merges')
  .toString()
  .trim();

const allowedTypes = types.map((type) => type.value).join('|');
const allowedScopes = scopes.map((scope) => scope.name).join('|');

const commitMsgRegex = `(${allowedTypes})\\((${allowedScopes})\\)!?:\\s(([a-z0-9:\-\s])+)`;

const matchCommit = new RegExp(commitMsgRegex, 'g').test(gitMessage);
const matchRevert = /Revert/gi.test(gitMessage);
const matchRelease = /Release/gi.test(gitMessage);
const exitCode = +!(matchRelease || matchRevert || matchCommit);

if (exitCode === 0) {
  console.log('Commit ACCEPTED 👍');
} else {
  console.log(
    '[Error]: Oh no! 😦 Your commit message: \n' +
      '-------------------------------------------------------------------\n' +
      gitMessage +
      '\n-------------------------------------------------------------------' +
      '\n\n 👉️ Does not follow the commit message convention specified in the Commit guide https://github.com/Future-Wallet/skia-wallet/wiki/Commits.' +
      '\n\n To edit your last commit message type:\n\tgit commit --amend -m "your_new_message'
  );
  console.log('\ntype(scope): subject \n BLANK LINE \n body');
  console.log('\n');
  console.log(`possible types: ${allowedTypes}`);
  console.log(`possible scopes: ${allowedScopes} (if unsure use "*")`);
  console.log(
    '\nEXAMPLE: \n' +
      'fix(entities): add the validation for `privateKey` when creating a new account\n' +
      'feat(ui-components): show the progress button\n' +
      'docs(common): add explanation for class `Error`\n'
  );
}
process.exit(exitCode);
