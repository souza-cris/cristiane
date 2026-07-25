# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a new project bootstrapped with Spec Kit (v0.14.3) for AI-assisted specification and planning workflows. No application code exists yet — only the Spec Kit scaffolding.

## Spec Kit

The `.specify/` directory contains Spec Kit configuration, templates, and scripts. The `.claude/skills/` directory contains Spec Kit skills (speckit-specify, speckit-plan, speckit-tasks, speckit-implement, speckit-clarify, speckit-analyze, speckit-converge, speckit-constitution, speckit-checklist, speckit-taskstoissues).

Use Spec Kit skills via slash commands (e.g., `/speckit-specify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement`) to drive the feature development workflow: specify → plan → tasks → implement.

The constitution at `.specify/memory/constitution.md` is a template that hasn't been customized yet. Use `/speckit-constitution` to define project principles before starting feature work.
