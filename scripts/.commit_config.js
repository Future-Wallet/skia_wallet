/**
 * This configuration is used by the NPM package `git-cz` https://www.npmjs.com/package/git-cz.
 *
 * Restrictions for the commit message following the commits guide
 * https://github.com/Future-Wallet/skia-wallet/wiki/Commits
 *
 * Inspired by Nx's repository https://github.com/nrwl/nx/commits/master/.cz-config.js
 */
module.exports = {
  types: [
    { value: 'feat', name: 'feat:    A new feature' },
    { value: 'fix', name: 'fix:    A bug fix' },
    { value: 'docs', name: 'docs:    Documentation only changes' },
    {
      value: 'refactor',
      name: 'refactor:    Restructure the code, change the internal behavior of method. Neither fixes a bug nor adds a feature',
    },
    {
      value: 'improv',
      name: 'improv:    An improvement, neither a bug fix nor a refactoring',
    },
    {
      value: 'chore',
      name: "chore:    Other changes that don't modify the packages or test files",
    },
    {
      value: 'ci',
      name: 'ci:    Debug tasks, edit git configuration, build process, scripts, etc',
    },
  ],

  scopes: [
    { name: 'common', description: 'Anything related to the package Common' },
    {
      name: 'entities',
      description: 'Anything related to the package Entities',
    },
    {
      name: 'repositories',
      description: 'Anything related to the package Repositories',
    },
    {
      name: 'ui-components',
      description:
        'Anything related to the package containing the frontend components',
    },
    {
      name: 'ui-wallet',
      description: 'Anything related to the package with the wallet website',
    },
    {
      name: 'repo',
      description: 'Anything related to managing the repo itself',
    },
    {
      name: 'test',
      description: 'Anything testing specific (e.g., jest or cypress)',
    },
    // Regex needs [ and ], else an asterix alone causes problems.
    { name: '[*]', description: 'Multiple scopes' },
  ],

  // Add tickets references (Github's issues or other task management tickets id)
  allowTicketNumber: true,
  isTicketNumberRequired: false,
  ticketNumberPrefix: 'TICKET-',
  ticketNumberRegExp: '\\d{1,5}',

  // override the messages, defaults are as follows
  messages: {
    type: "Select the type of change that you're committing:",
    scope: '\nDenote the SCOPE of this change (optional):',
    // used if allowCustomScopes is true
    customScope: 'Denote the SCOPE of this change:',
    subject:
      'Write a SHORT, IMPERATIVE (lowercase) description of the change:\n',
    body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
    breaking: 'List any BREAKING CHANGES (optional):\n',
    footer:
      'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n',
    confirmCommit: 'Are you sure you want to proceed with the commit above?',
  },

  allowCustomScopes: false,
  allowBreakingChanges: ['feat', 'fix'],
  // skip any questions you want
  skipQuestions: ['ticketNumber'],

  // limit subject length
  subjectLimit: 100,
  // breaklineChar: '|', // It is supported for fields body and footer.
  // footerPrefix : 'ISSUES CLOSED:'
  // askForBreakingChangeFirst : true, // default is false
};
