# Skill Registry — personal-portfolio-master

<!-- Maintained by sdd-init. Index only — SKILL.md files remain the source of truth. -->

Last updated: 2026-08-31

## Sources scanned

User skill roots:

- `~/.claude/skills`
- `~/.config/opencode/skills`
- `~/.gemini/skills`
- `~/.cursor/skills`
- `~/.copilot/skills`
- `~/.codex/skills` (empty)

Project skill roots: none found (`skills/`, `.claude/skills/`, `.agent/skills/`, `.atl/skills/` absent).

Project convention files: none found (`AGENTS.md`, project `CLAUDE.md`, `.cursorrules`, `GEMINI.md`, `copilot-instructions.md` absent). Global `~/.claude/CLAUDE.md` applies but is not project-scoped.

Excluded per scan rules: `sdd-*`, `_shared`, `skill-registry`. Deduplicated by skill name; identical skill sets exist across all user roots, so `~/.claude/skills` paths are used as canonical for this runtime.

## Contract

**Delegator use only.** This registry is an index, not a summary. Any agent that launches subagents reads it to select relevant skills, then passes exact `SKILL.md` paths for the subagent to read before work.

`SKILL.md` remains the source of truth. Pass paths, not generated summaries, so subagents load the full runtime contract.

## Skills

| Skill | Trigger / description | Scope | Path |
| --- | --- | --- | --- |
| `branch-pr` | Create Gentle AI pull requests with issue-first checks. Trigger: creating, opening, or preparing PRs for review. | user | `/Users/gbarazzutti/.claude/skills/branch-pr/SKILL.md` |
| `chained-pr` | Trigger: PRs over 400 lines, stacked PRs, review slices. Split oversized changes into chained PRs that protect review focus. | user | `/Users/gbarazzutti/.claude/skills/chained-pr/SKILL.md` |
| `cognitive-doc-design` | Design docs that reduce cognitive load. Trigger: writing guides, READMEs, RFCs, onboarding, architecture, or review-facing docs. | user | `/Users/gbarazzutti/.claude/skills/cognitive-doc-design/SKILL.md` |
| `comment-writer` | Write warm, direct collaboration comments. Trigger: PR feedback, issue replies, reviews, Slack messages, or GitHub comments. | user | `/Users/gbarazzutti/.claude/skills/comment-writer/SKILL.md` |
| `go-testing` | Trigger: Go tests, go test coverage, Bubbletea teatest, golden files. Apply focused Go testing patterns. | user | `/Users/gbarazzutti/.claude/skills/go-testing/SKILL.md` |
| `issue-creation` | Create and triage GitHub issues from repository evidence. Trigger: issue creation, bug reports, feature requests, or issue approval. | user | `/Users/gbarazzutti/.claude/skills/issue-creation/SKILL.md` |
| `judgment-day` | Trigger: judgment day, dual review, adversarial review, juzgar. Run explicit blind dual review with at most two scoped fix/re-judgment rounds. | user | `/Users/gbarazzutti/.claude/skills/judgment-day/SKILL.md` |
| `skill-creator` | Trigger: new skills, agent instructions, documenting AI usage patterns. Create LLM-first skills with valid frontmatter. | user | `/Users/gbarazzutti/.claude/skills/skill-creator/SKILL.md` |
| `skill-improver` | Trigger: improve skills, audit skills, refactor skills, skill quality. Audit and upgrade existing LLM-first skills. | user | `/Users/gbarazzutti/.claude/skills/skill-improver/SKILL.md` |
| `work-unit-commits` | Plan commits as reviewable work units. Trigger: implementation, commit splitting, chained PRs, or keeping tests and docs with code. | user | `/Users/gbarazzutti/.claude/skills/work-unit-commits/SKILL.md` |

## Loading protocol

1. Match task context and target files against the `Trigger / description` column.
2. Pass only the matching `Path` values to the subagent under `## Skills to load before work`.
3. Instruct the subagent to read those exact `SKILL.md` files before reading, writing, reviewing, testing, or creating artifacts.
4. If no matching skill exists, proceed without project skill injection and report `skill_resolution: none`.

## Notes for the Astro rebuild

- No frontend-framework, testing, or linting skills are installed. If the rebuild adopts Astro with Vitest/Playwright, consider adding matching skills later.
- `go-testing` is not applicable to this project (no Go code).
