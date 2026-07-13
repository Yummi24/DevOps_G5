# BrainBytes CI/CD Documentation

[![.github/workflows/main.yml](https://github.com/FelicityS1/DevOps_G5/actions/workflows/main.yml/badge.svg)](https://github.com/FelicityS1/DevOps_G5/actions/workflows/main.yml)

[![BrainBytes CI](https://github.com/FelicityS1/DevOps_G5/actions/workflows/ci.yml/badge.svg)](https://github.com/FelicityS1/DevOps_G5/actions/workflows/ci.yml)

[![BrainBytes Deploy](https://github.com/FelicityS1/DevOps_G5/actions/workflows/deploy.yml/badge.svg)](https://github.com/FelicityS1/DevOps_G5/actions/workflows/deploy.yml)

[![BrainBytes Docker Build](https://github.com/FelicityS1/DevOps_G5/actions/workflows/build.yml/badge.svg)](https://github.com/FelicityS1/DevOps_G5/actions/workflows/build.yml)


[![BrainBytes Lint](https://github.com/FelicityS1/DevOps_G5/actions/workflows/lint.yml/badge.svg)](https://github.com/FelicityS1/DevOps_G5/actions/workflows/lint.yml)


# BrainBytes CI/CD Documentation

## Overview

This document describes the Continuous Integration and Continuous Deployment (CI/CD) implementation for the BrainBytes AI Tutoring Platform. The project uses GitHub Actions to automate code quality checks, testing, Docker image building, and deployment preparation.

The goal of the CI/CD pipeline is to improve software quality by automatically validating changes whenever code is pushed to the repository or submitted through a pull request.

---

# Implemented Workflows

## 1. BrainBytes CI (`ci.yml`)

### Purpose

This workflow verifies that the application can be built successfully.

### Functions

* Checks out the repository
* Sets up the Node.js environment
* Installs frontend dependencies
* Builds the frontend application
* Installs backend dependencies

### Trigger

* Push to `main`
* Push to `development`
* Pull Request

---

## 2. BrainBytes Docker Build (`build.yml`)

### Purpose

Builds Docker images for both the frontend and backend applications.

### Functions

* Checks out the repository
* Configures Docker Buildx
* Builds frontend Docker image
* Builds backend Docker image
* Tests Docker Compose configuration

### Trigger

* Push to `main`
* Push to `development`
* Manual execution

---

## 3. BrainBytes Lint (`lint.yml`)

### Purpose

Performs automated code quality checks.

### Functions

* Installs project dependencies
* Runs lint checks
* Runs ESLint
* Checks code formatting
* Performs dependency vulnerability scanning
* Checks for large files
* Scans for potential secrets

### Trigger

* Push
* Pull Request

---

## 4. BrainBytes CI/CD (`main.yml`)

### Purpose

Executes the complete Continuous Integration pipeline.

### Pipeline Stages

#### Lint

Performs code quality verification.

#### Test

Runs frontend and backend tests.

#### Build

Builds Docker images and validates Docker Compose.

### Additional Features

* Dependency caching
* Docker layer caching
* Matrix builds
* Workflow artifacts
* Code coverage reporting
* Job timeouts

### Trigger

* Push
* Pull Request
* Manual execution

---

## 5. BrainBytes Deploy (`deploy.yml`)

### Purpose

Simulates deployment to a test environment.

### Functions

* Builds Docker images
* Sets deployment environment variables
* Simulates deployment
* Performs deployment verification
* Supports branch-specific deployment logic

### Trigger

* Push to `main`
* Push to `development`
* Manual execution

---

# Manual Workflow Execution

Any workflow can be executed manually by following these steps:

1. Open the GitHub repository.
2. Select the **Actions** tab.
3. Choose the workflow you want to execute.
4. Click **Run workflow**.
5. Select the desired branch.
6. Click **Run workflow** to start the workflow.

---

# Workflow Status Badges

GitHub automatically generates workflow badges that indicate the current status of each workflow.

Status meanings:

* ✅ **Passing** – The workflow completed successfully.
* ❌ **Failed** – One or more workflow jobs failed.
* 🟡 **Running** – The workflow is currently executing.

---

# CI/CD Features Implemented

The following DevOps features were implemented during this project:

* GitHub Actions workflows
* Continuous Integration
* Continuous Deployment simulation
* Docker image builds
* Docker Compose validation
* Dependency caching
* Docker layer caching
* Matrix builds
* Workflow artifacts
* Code coverage reporting
* Job timeouts
* ESLint integration
* Code formatting checks
* Dependency vulnerability scanning
* Large file detection
* Secret scanning

---

# Troubleshooting

## Workflow Failure

Possible causes:

* YAML syntax errors
* Missing workflow permissions
* Missing repository secrets
* Docker build failures
* Dependency installation failures

Solution:

* Review the workflow logs in the GitHub Actions tab.
* Verify workflow syntax.
* Ensure required dependencies are installed.
* Confirm repository secrets are configured.

---

## Docker Build Issues

Possible causes:

* Docker Compose configuration errors
* Missing Dockerfile
* Invalid build context

Solution:

* Validate the Docker Compose configuration.
* Verify Dockerfiles exist.
* Ensure Docker images build successfully locally.

---

## Matrix Build Failures

Possible causes:

* Unsupported Node.js versions
* Dependency incompatibility

Solution:

* Review the failed Node.js version.
* Verify package compatibility.

---

## Deployment Issues

Possible causes:

* Incorrect deployment configuration
* Missing environment variables
* Docker services not starting correctly

Solution:

* Verify deployment variables.
* Check Docker Compose configuration.
* Review deployment workflow logs.
