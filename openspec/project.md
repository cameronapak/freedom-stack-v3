# Project Context

## Purpose
Simple microblog application for posting and deleting content

## Tech Stack
- Bun runtime
- Hono (web framework + JSX)
- Bknd (database ORM with SQLite)
- TypeScript (strict mode)
- Datastar (SSE-based frontend interactions)
- BasecoatCSS (CSS framework)
- UnoCSS (utility CSS)

## Project Conventions

### Code Style
- TypeScript strict mode enabled
- Hono JSX for components
- Import style: `import { Type } from 'module'` on separate lines
- Component exports: `export function ComponentName()`
- Props interface: `type Props = { ... }`
- File naming: kebab-case (todo-list-item.tsx)
- CSS classes via UnoCSS/Basecoat patterns
- Error handling: simple console.error for debugging
- Keep components single-responsibility
- Use async/await for API calls
- No complex abstractions - prefer direct solutions

### Architecture Patterns
- Server-rendered HTML with Hono
- Datastar SSE for real-time UI updates (no client-side routing)
- Bknd ORM with SQLite for data persistence
- Component-based UI structure

### Testing Strategy
No test framework configured

### Git Workflow
Not specified

## Domain Context
Microblog - users create text posts, view them chronologically, and delete posts. Admin panel available via Bknd.

## Important Constraints
- POC project - prefer simplicity over best practices
- Solo developer - no enterprise patterns
- Direct solutions over abstractions
- No premature optimization

## External Dependencies
- Frontend libs loaded via CDN (BasecoatCSS, UnoCSS, Datastar)
- SQLite for local data storage
