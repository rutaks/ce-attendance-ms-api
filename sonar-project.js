const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner(
  {
    serverUrl: 'http://localhost:9000',
    options: {
      'sonar.projectName': 'CE MS',
      'sonar.sources': '.',
      'sonar.inclusions': 'src/**',
    },
  },
  () => {},
);
