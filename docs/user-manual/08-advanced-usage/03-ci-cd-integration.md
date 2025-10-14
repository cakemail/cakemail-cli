# CI/CD Integration

Integrate Cakemail CLI into continuous integration and deployment pipelines for automated email marketing workflows.

## Overview

Learn to:
- Integrate with GitHub Actions
- Configure GitLab CI pipelines
- Set up Jenkins jobs
- Use Docker containers
- Implement deployment strategies
- Handle secrets securely
- Test campaigns automatically

## GitHub Actions

### Basic Campaign Deployment

```yaml
# .github/workflows/deploy-campaign.yml
name: Deploy Email Campaign

on:
  push:
    branches: [main]
    paths:
      - 'campaigns/**'
      - '.github/workflows/deploy-campaign.yml'

env:
  LIST_ID: 123
  SENDER_ID: 101

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Cakemail CLI
        run: npm install -g @cakemail-org/cakemail-cli

      - name: Configure Cakemail
        env:
          CAKEMAIL_EMAIL: ${{ secrets.CAKEMAIL_EMAIL }}
          CAKEMAIL_PASSWORD: ${{ secrets.CAKEMAIL_PASSWORD }}
        run: |
          echo "CAKEMAIL_EMAIL=$CAKEMAIL_EMAIL" > .env
          echo "CAKEMAIL_PASSWORD=$CAKEMAIL_PASSWORD" >> .env

      - name: Validate HTML
        run: |
          npm install -g html-validator-cli
          html-validator campaigns/*.html

      - name: Create campaign
        id: create
        run: |
          CAMPAIGN_ID=$(cakemail campaigns create \
            -n "Campaign $(date +%Y-%m-%d)" \
            -l ${{ env.LIST_ID }} \
            -s ${{ env.SENDER_ID }} \
            --html-file campaigns/newsletter.html \
            --subject "$(cat campaigns/subject.txt)" \
            -f json | jq -r '.id')
          echo "campaign_id=$CAMPAIGN_ID" >> $GITHUB_OUTPUT
          echo "Created campaign: $CAMPAIGN_ID"

      - name: Send test email
        run: |
          cakemail campaigns test ${{ steps.create.outputs.campaign_id }} \
            -e ${{ secrets.TEST_EMAIL }}

      - name: Schedule campaign
        if: github.ref == 'refs/heads/main'
        run: |
          cakemail campaigns schedule ${{ steps.create.outputs.campaign_id }} \
            --when "$(date -d 'tomorrow 09:00' '+%Y-%m-%d %H:%M:%S')"

      - name: Comment on commit
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.repos.createCommitComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              commit_sha: context.sha,
              body: '✅ Campaign ${{ steps.create.outputs.campaign_id }} deployed successfully'
            })
```

### Multi-Environment Deployment

```yaml
# .github/workflows/multi-env-deploy.yml
name: Multi-Environment Deploy

on:
  push:
    branches: [develop, staging, main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        include:
          - branch: develop
            environment: development
            list_id: 123
            sender_id: 101
            auto_send: false
          - branch: staging
            environment: staging
            list_id: 124
            sender_id: 102
            auto_send: false
          - branch: main
            environment: production
            list_id: 125
            sender_id: 103
            auto_send: true

    steps:
      - uses: actions/checkout@v3

      - name: Setup environment
        if: github.ref == format('refs/heads/{0}', matrix.branch)
        run: |
          echo "ENVIRONMENT=${{ matrix.environment }}" >> $GITHUB_ENV
          echo "LIST_ID=${{ matrix.list_id }}" >> $GITHUB_ENV
          echo "SENDER_ID=${{ matrix.sender_id }}" >> $GITHUB_ENV

      - name: Install CLI
        if: github.ref == format('refs/heads/{0}', matrix.branch)
        run: npm install -g @cakemail-org/cakemail-cli

      - name: Configure Cakemail
        if: github.ref == format('refs/heads/{0}', matrix.branch)
        env:
          CAKEMAIL_EMAIL: ${{ secrets[format('CAKEMAIL_EMAIL_{0}', matrix.environment)] }}
          CAKEMAIL_PASSWORD: ${{ secrets[format('CAKEMAIL_PASSWORD_{0}', matrix.environment)] }}
        run: |
          echo "CAKEMAIL_EMAIL=$CAKEMAIL_EMAIL" > .env
          echo "CAKEMAIL_PASSWORD=$CAKEMAIL_PASSWORD" >> .env

      - name: Deploy campaign
        if: github.ref == format('refs/heads/{0}', matrix.branch)
        run: |
          echo "Deploying to ${{ matrix.environment }}"
          CAMPAIGN_ID=$(cakemail campaigns create \
            -n "[${{ matrix.environment }}] Newsletter" \
            -l ${{ matrix.list_id }} \
            -s ${{ matrix.sender_id }} \
            --html-file campaigns/newsletter.html \
            -f json | jq -r '.id')

          if [ "${{ matrix.auto_send }}" = "true" ]; then
            cakemail campaigns schedule "$CAMPAIGN_ID"
          else
            echo "Campaign created but not scheduled (manual approval required)"
          fi
```

### Scheduled Campaign Workflow

```yaml
# .github/workflows/scheduled-newsletter.yml
name: Scheduled Newsletter

on:
  schedule:
    # Run every Monday at 8 AM UTC
    - cron: '0 8 * * 1'
  workflow_dispatch:  # Allow manual trigger

jobs:
  send-newsletter:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Install CLI
        run: npm install -g @cakemail-org/cakemail-cli

      - name: Configure
        env:
          CAKEMAIL_EMAIL: ${{ secrets.CAKEMAIL_EMAIL }}
          CAKEMAIL_PASSWORD: ${{ secrets.CAKEMAIL_PASSWORD }}
        run: |
          echo "CAKEMAIL_EMAIL=$CAKEMAIL_EMAIL" > .env
          echo "CAKEMAIL_PASSWORD=$CAKEMAIL_PASSWORD" >> .env

      - name: Generate content
        run: |
          # Generate dynamic content (example)
          ./scripts/generate-newsletter-content.sh > campaigns/weekly-newsletter.html

      - name: Create and send
        run: |
          CAMPAIGN_ID=$(cakemail campaigns create \
            -n "Weekly Newsletter $(date +%Y-%m-%d)" \
            -l 123 \
            -s 101 \
            --html-file campaigns/weekly-newsletter.html \
            --subject "This Week's Top Stories" \
            -f json | jq -r '.id')

          cakemail campaigns schedule "$CAMPAIGN_ID"
          echo "Newsletter scheduled: $CAMPAIGN_ID"

      - name: Notify Slack
        if: always()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "Weekly newsletter deployment: ${{ job.status }}"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Pull Request Preview

```yaml
# .github/workflows/pr-preview.yml
name: Campaign Preview

on:
  pull_request:
    paths:
      - 'campaigns/**'

jobs:
  preview:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Install CLI
        run: npm install -g @cakemail-org/cakemail-cli

      - name: Configure
        env:
          CAKEMAIL_EMAIL: ${{ secrets.CAKEMAIL_EMAIL }}
          CAKEMAIL_PASSWORD: ${{ secrets.CAKEMAIL_PASSWORD }}
        run: |
          echo "CAKEMAIL_EMAIL=$CAKEMAIL_EMAIL" > .env
          echo "CAKEMAIL_PASSWORD=$CAKEMAIL_PASSWORD" >> .env

      - name: Create preview campaign
        id: preview
        run: |
          CAMPAIGN_ID=$(cakemail campaigns create \
            -n "[PREVIEW] PR #${{ github.event.pull_request.number }}" \
            -l 123 \
            -s 101 \
            --html-file campaigns/newsletter.html \
            --subject "[PREVIEW] ${{ github.event.pull_request.title }}" \
            -f json | jq -r '.id')
          echo "campaign_id=$CAMPAIGN_ID" >> $GITHUB_OUTPUT

      - name: Send test email
        run: |
          cakemail campaigns test ${{ steps.preview.outputs.campaign_id }} \
            -e ${{ github.event.pull_request.user.email }}

      - name: Comment on PR
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## 📧 Campaign Preview\n\nPreview campaign created: **${{ steps.preview.outputs.campaign_id }}**\n\nTest email sent to: ${context.payload.pull_request.user.email}\n\n[View in Cakemail](https://app.cakemail.com/campaigns/${{ steps.preview.outputs.campaign_id }})`
            })
```

## GitLab CI

### Basic Pipeline

```yaml
# .gitlab-ci.yml
stages:
  - validate
  - build
  - deploy

variables:
  LIST_ID: "123"
  SENDER_ID: "101"

before_script:
  - npm install -g @cakemail-org/cakemail-cli
  - echo "CAKEMAIL_EMAIL=$CAKEMAIL_EMAIL" > .env
  - echo "CAKEMAIL_PASSWORD=$CAKEMAIL_PASSWORD" >> .env

validate:
  stage: validate
  script:
    - npm install -g html-validator-cli
    - html-validator campaigns/*.html
    - echo "HTML validation passed"
  only:
    - merge_requests
    - main

test_campaign:
  stage: build
  script:
    - |
      CAMPAIGN_ID=$(cakemail campaigns create \
        -n "[TEST] Campaign" \
        -l $LIST_ID \
        -s $SENDER_ID \
        --html-file campaigns/newsletter.html \
        -f json | jq -r '.id')
      cakemail campaigns test $CAMPAIGN_ID -e test@company.com
      echo "Test email sent for campaign $CAMPAIGN_ID"
  only:
    - merge_requests

deploy_production:
  stage: deploy
  script:
    - |
      CAMPAIGN_ID=$(cakemail campaigns create \
        -n "Newsletter $(date +%Y-%m-%d)" \
        -l $LIST_ID \
        -s $SENDER_ID \
        --html-file campaigns/newsletter.html \
        --subject "$(cat campaigns/subject.txt)" \
        -f json | jq -r '.id')
      cakemail campaigns schedule $CAMPAIGN_ID --when "$(date -d 'tomorrow 09:00' '+%Y-%m-%d %H:%M:%S')"
      echo "Campaign $CAMPAIGN_ID scheduled"
  only:
    - main
  when: manual
```

### Multi-Stage Pipeline

```yaml
# .gitlab-ci.yml
stages:
  - test
  - staging
  - production

.deploy_template: &deploy_config
  before_script:
    - npm install -g @cakemail-org/cakemail-cli
    - echo "CAKEMAIL_EMAIL=$CAKEMAIL_EMAIL" > .env
    - echo "CAKEMAIL_PASSWORD=$CAKEMAIL_PASSWORD" >> .env
  script:
    - |
      CAMPAIGN_ID=$(cakemail campaigns create \
        -n "[$CI_ENVIRONMENT_NAME] Newsletter" \
        -l $LIST_ID \
        -s $SENDER_ID \
        --html-file campaigns/newsletter.html \
        -f json | jq -r '.id')
      echo "Created campaign: $CAMPAIGN_ID"

      if [ "$AUTO_SEND" = "true" ]; then
        cakemail campaigns schedule $CAMPAIGN_ID
        echo "Campaign scheduled"
      fi

test:
  <<: *deploy_config
  stage: test
  variables:
    LIST_ID: "123"
    SENDER_ID: "101"
    AUTO_SEND: "false"
  environment:
    name: test
  only:
    - merge_requests

staging:
  <<: *deploy_config
  stage: staging
  variables:
    LIST_ID: "124"
    SENDER_ID: "102"
    AUTO_SEND: "false"
  environment:
    name: staging
  only:
    - develop

production:
  <<: *deploy_config
  stage: production
  variables:
    LIST_ID: "125"
    SENDER_ID: "103"
    AUTO_SEND: "true"
  environment:
    name: production
  only:
    - main
  when: manual
```

## Jenkins

### Declarative Pipeline

```groovy
// Jenkinsfile
pipeline {
    agent any

    environment {
        CAKEMAIL_EMAIL = credentials('cakemail-email')
        CAKEMAIL_PASSWORD = credentials('cakemail-password')
        LIST_ID = '123'
        SENDER_ID = '101'
    }

    stages {
        stage('Setup') {
            steps {
                sh 'npm install -g @cakemail-org/cakemail-cli'
                sh '''
                    echo "CAKEMAIL_EMAIL=$CAKEMAIL_EMAIL" > .env
                    echo "CAKEMAIL_PASSWORD=$CAKEMAIL_PASSWORD" >> .env
                '''
            }
        }

        stage('Validate') {
            steps {
                sh 'npm install -g html-validator-cli'
                sh 'html-validator campaigns/*.html'
            }
        }

        stage('Create Campaign') {
            steps {
                script {
                    def campaignId = sh(
                        script: '''
                            cakemail campaigns create \
                                -n "Jenkins Campaign ${BUILD_NUMBER}" \
                                -l ${LIST_ID} \
                                -s ${SENDER_ID} \
                                --html-file campaigns/newsletter.html \
                                -f json | jq -r '.id'
                        ''',
                        returnStdout: true
                    ).trim()

                    env.CAMPAIGN_ID = campaignId
                    echo "Created campaign: ${campaignId}"
                }
            }
        }

        stage('Test') {
            steps {
                sh 'cakemail campaigns test ${CAMPAIGN_ID} -e test@company.com'
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy campaign?', ok: 'Deploy'
                sh 'cakemail campaigns schedule ${CAMPAIGN_ID}'
            }
        }
    }

    post {
        success {
            slackSend(
                color: 'good',
                message: "Campaign ${env.CAMPAIGN_ID} deployed successfully"
            )
        }
        failure {
            slackSend(
                color: 'danger',
                message: "Campaign deployment failed"
            )
        }
        always {
            cleanWs()
        }
    }
}
```

### Parameterized Build

```groovy
// Jenkinsfile
pipeline {
    agent any

    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['test', 'staging', 'production'],
            description: 'Target environment'
        )
        string(
            name: 'CAMPAIGN_NAME',
            defaultValue: 'Newsletter',
            description: 'Campaign name'
        )
        booleanParam(
            name: 'AUTO_SCHEDULE',
            defaultValue: false,
            description: 'Automatically schedule campaign'
        )
    }

    environment {
        CAKEMAIL_EMAIL = credentials("cakemail-email-${params.ENVIRONMENT}")
        CAKEMAIL_PASSWORD = credentials("cakemail-password-${params.ENVIRONMENT}")
    }

    stages {
        stage('Setup') {
            steps {
                sh 'npm install -g @cakemail-org/cakemail-cli'
                sh '''
                    echo "CAKEMAIL_EMAIL=$CAKEMAIL_EMAIL" > .env
                    echo "CAKEMAIL_PASSWORD=$CAKEMAIL_PASSWORD" >> .env
                '''
            }
        }

        stage('Get Environment Config') {
            steps {
                script {
                    def config = [
                        test: [list_id: '123', sender_id: '101'],
                        staging: [list_id: '124', sender_id: '102'],
                        production: [list_id: '125', sender_id: '103']
                    ]

                    env.LIST_ID = config[params.ENVIRONMENT].list_id
                    env.SENDER_ID = config[params.ENVIRONMENT].sender_id

                    echo "Deploying to ${params.ENVIRONMENT}"
                    echo "List ID: ${env.LIST_ID}"
                    echo "Sender ID: ${env.SENDER_ID}"
                }
            }
        }

        stage('Create Campaign') {
            steps {
                script {
                    def campaignId = sh(
                        script: """
                            cakemail campaigns create \
                                -n '[${params.ENVIRONMENT}] ${params.CAMPAIGN_NAME}' \
                                -l ${env.LIST_ID} \
                                -s ${env.SENDER_ID} \
                                --html-file campaigns/newsletter.html \
                                -f json | jq -r '.id'
                        """,
                        returnStdout: true
                    ).trim()

                    env.CAMPAIGN_ID = campaignId
                }
            }
        }

        stage('Schedule') {
            when {
                expression { params.AUTO_SCHEDULE == true }
            }
            steps {
                sh 'cakemail campaigns schedule ${CAMPAIGN_ID}'
            }
        }
    }
}
```

## Docker Integration

### Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine

# Install Cakemail CLI
RUN npm install -g @cakemail-org/cakemail-cli

# Install additional tools
RUN apk add --no-cache \
    bash \
    jq \
    curl

# Set working directory
WORKDIR /workspace

# Copy campaign files
COPY campaigns/ ./campaigns/
COPY scripts/ ./scripts/

# Set entrypoint
ENTRYPOINT ["bash"]
```

### Docker Compose Workflow

```yaml
# docker-compose.yml
version: '3.8'

services:
  cakemail-cli:
    build: .
    environment:
      - CAKEMAIL_EMAIL=${CAKEMAIL_EMAIL}
      - CAKEMAIL_PASSWORD=${CAKEMAIL_PASSWORD}
    volumes:
      - ./campaigns:/workspace/campaigns
      - ./scripts:/workspace/scripts
      - ./reports:/workspace/reports
    command: /workspace/scripts/deploy-campaign.sh

  scheduled-newsletter:
    build: .
    environment:
      - CAKEMAIL_EMAIL=${CAKEMAIL_EMAIL}
      - CAKEMAIL_PASSWORD=${CAKEMAIL_PASSWORD}
    volumes:
      - ./campaigns:/workspace/campaigns
    command: /workspace/scripts/send-newsletter.sh
    deploy:
      restart_policy:
        condition: none
```

### Docker Run Examples

```bash
# One-off campaign deployment
docker run --rm \
  -e CAKEMAIL_EMAIL="your@email.com" \
  -e CAKEMAIL_PASSWORD="password" \
  -v $(pwd)/campaigns:/workspace/campaigns \
  cakemail-cli:latest \
  -c "cakemail campaigns create -n 'Docker Campaign' -l 123 -s 101 --html-file campaigns/newsletter.html"

# Scheduled report generation
docker run --rm \
  -e CAKEMAIL_EMAIL="your@email.com" \
  -e CAKEMAIL_PASSWORD="password" \
  -v $(pwd)/reports:/workspace/reports \
  cakemail-cli:latest \
  /workspace/scripts/generate-reports.sh
```

## CircleCI

### Basic Configuration

```yaml
# .circleci/config.yml
version: 2.1

executors:
  cakemail:
    docker:
      - image: node:18
    working_directory: ~/project

jobs:
  deploy-campaign:
    executor: cakemail
    steps:
      - checkout

      - run:
          name: Install CLI
          command: npm install -g @cakemail-org/cakemail-cli

      - run:
          name: Configure
          command: |
            echo "CAKEMAIL_EMAIL=$CAKEMAIL_EMAIL" > .env
            echo "CAKEMAIL_PASSWORD=$CAKEMAIL_PASSWORD" >> .env

      - run:
          name: Create campaign
          command: |
            CAMPAIGN_ID=$(cakemail campaigns create \
              -n "Campaign $(date +%Y-%m-%d)" \
              -l 123 \
              -s 101 \
              --html-file campaigns/newsletter.html \
              -f json | jq -r '.id')
            echo "export CAMPAIGN_ID=$CAMPAIGN_ID" >> $BASH_ENV

      - run:
          name: Test campaign
          command: cakemail campaigns test $CAMPAIGN_ID -e test@company.com

      - run:
          name: Schedule campaign
          command: cakemail campaigns schedule $CAMPAIGN_ID

workflows:
  version: 2
  deploy:
    jobs:
      - deploy-campaign:
          filters:
            branches:
              only: main
          context: cakemail-production
```

## Azure DevOps

### Pipeline Configuration

```yaml
# azure-pipelines.yml
trigger:
  branches:
    include:
      - main
  paths:
    include:
      - campaigns/*

pool:
  vmImage: 'ubuntu-latest'

variables:
  LIST_ID: 123
  SENDER_ID: 101

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '18.x'
    displayName: 'Install Node.js'

  - script: |
      npm install -g @cakemail-org/cakemail-cli
    displayName: 'Install Cakemail CLI'

  - task: Bash@3
    inputs:
      targetType: 'inline'
      script: |
        echo "CAKEMAIL_EMAIL=$(CAKEMAIL_EMAIL)" > .env
        echo "CAKEMAIL_PASSWORD=$(CAKEMAIL_PASSWORD)" >> .env
    displayName: 'Configure credentials'
    env:
      CAKEMAIL_EMAIL: $(CAKEMAIL_EMAIL)
      CAKEMAIL_PASSWORD: $(CAKEMAIL_PASSWORD)

  - script: |
      CAMPAIGN_ID=$(cakemail campaigns create \
        -n "Campaign $(date +%Y-%m-%d)" \
        -l $(LIST_ID) \
        -s $(SENDER_ID) \
        --html-file campaigns/newsletter.html \
        -f json | jq -r '.id')
      echo "##vso[task.setvariable variable=campaignId]$CAMPAIGN_ID"
      echo "Created campaign: $CAMPAIGN_ID"
    displayName: 'Create campaign'

  - script: |
      cakemail campaigns test $(campaignId) -e test@company.com
    displayName: 'Send test email'

  - script: |
      cakemail campaigns schedule $(campaignId)
    displayName: 'Schedule campaign'
    condition: eq(variables['Build.SourceBranch'], 'refs/heads/main')
```

## Best Practices

### 1. Secure Credential Management

```yaml
# Use encrypted secrets
env:
  CAKEMAIL_EMAIL: ${{ secrets.CAKEMAIL_EMAIL }}
  CAKEMAIL_PASSWORD: ${{ secrets.CAKEMAIL_PASSWORD }}

# Never commit credentials
echo ".env" >> .gitignore
```

### 2. Environment Separation

```bash
# Use different accounts/lists per environment
TEST_LIST_ID=123
STAGING_LIST_ID=124
PROD_LIST_ID=125
```

### 3. Automated Testing

```yaml
- name: Validate HTML
  run: html-validator campaigns/*.html

- name: Check subject line length
  run: |
    SUBJECT=$(cat campaigns/subject.txt)
    LENGTH=${#SUBJECT}
    if [ $LENGTH -gt 60 ]; then
      echo "Subject too long: $LENGTH chars"
      exit 1
    fi
```

### 4. Rollback Strategy

```bash
# Save campaign ID for rollback
echo "$CAMPAIGN_ID" > .last-deployment

# Rollback if needed
LAST_ID=$(cat .last-deployment)
cakemail campaigns unschedule "$LAST_ID"
```

### 5. Notifications

```yaml
- name: Notify success
  if: success()
  run: |
    curl -X POST $SLACK_WEBHOOK \
      -d '{"text":"✅ Campaign deployed"}'

- name: Notify failure
  if: failure()
  run: |
    curl -X POST $SLACK_WEBHOOK \
      -d '{"text":"❌ Campaign deployment failed"}'
```

### 6. Logging and Auditing

```bash
# Log all operations
exec 1> >(tee -a deploy.log)
exec 2>&1

echo "[$(date)] Starting deployment..."
```

### 7. Conditional Deployment

```yaml
- name: Deploy
  if: |
    github.ref == 'refs/heads/main' &&
    contains(github.event.head_commit.message, '[deploy]')
  run: ./scripts/deploy.sh
```

