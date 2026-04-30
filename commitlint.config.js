module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Tính năng mới
        'fix',      // Sửa bug
        'docs',     // Cập nhật tài liệu
        'style',    // Format code
        'refactor', // Refactor code
        'test',     // Thêm/sửa tests
        'chore',    // Cập nhật build tools, dependencies
        'perf',     // Cải thiện performance
        'ci',       // CI/CD changes
        'revert',   // Revert commit
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'auth',       // Authentication/Authorization
        'episodes',   // Episode management
        'predictions',// Detector predictions
        'drafts',     // Draft reports
        'knowledge',  // Knowledge base/RAG
        'audit',      // Audit trail
        'ui',         // UI components
        'api',        // API routes
        'db',         // Database
        'config',     // Configuration
        'deps',       // Dependencies
      ],
    ],
    'subject-case': [2, 'never', ['upper-case']],
    'header-max-length': [2, 'always', 100],
  },
}
