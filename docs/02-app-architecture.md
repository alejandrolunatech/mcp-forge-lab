# App Architecture

You are designing the architecture for a gamified learning lab.

## Core Concept

The app is driven by structured content, not hardcoded UI.

## Create:

### 1. Content Schema

Define a TypeScript interface:

```
LessonStep {
  id: string
  title: string
  description: string
  code?: string
  command?: string
  explanation?: string
  hint?: string
  os?: "mac" | "windows" | "both"
}
```

### 2. World Structure

```
World {
  id: string
  title: string
  regions: Region[]
}

Region {
  id: string
  title: string
  steps: LessonStep[]
}
```

### 3. Engine Folder

Create:

```
engine/
  lessonEngine.ts
  progressEngine.ts
```

### 4. Lesson Engine Responsibilities

* Load worlds
* Track current step
* Move next/previous
* Mark step complete

### 5. Progress Engine

* Store progress in localStorage
* Track completion %

## Output

* Clean architecture
* No UI yet
