---
title: 'Starting this thing'
description: 'Why I am writing in public, and what I plan to put here.'
pubDate: 2026-08-24
tags: ['meta']
draft: false
---

This is a sample post. It exists so you can see how the typography, code blocks,
tables, and the table of contents behave before you write your own. Delete it
when you publish something real.

## How posting works

Every file in `src/content/blog/` becomes a post. The frontmatter at the top of
this file is validated at build time, so a typo in a field name fails the build
instead of silently rendering a broken page.

Set `draft: true` to keep a post out of the index, the home page, and the RSS
feed while still being able to preview it locally.

## What the prose styles cover

Inline `code`, [links](https://example.com), **bold text**, and lists:

- Body copy is capped at 68 characters per line, which is the readable range
- Code blocks and tables get a wider measure since they need the room
- Long tables scroll inside their own container, never the page

Fenced code blocks are highlighted at build time, so no syntax-highlighting
JavaScript ships to the browser:

```go
func (s *Server) handle(ctx context.Context, req *Request) (*Response, error) {
	if err := req.Validate(); err != nil {
		return nil, fmt.Errorf("validate: %w", err)
	}
	return s.store.Commit(ctx, req)
}
```

Tables are readable too:

| Field | Type | Required |
| --- | --- | --- |
| `title` | string | yes |
| `description` | string | yes |
| `pubDate` | date | yes |
| `tags` | string array | no |
| `draft` | boolean | no |

## The table of contents

The sidebar on the right appears only when a post has three or more `##`
headings. Shorter posts do not need one, so they do not get one.

> Anything you quote gets a rule on the left and slightly quieter text, so it
> reads as an aside without shouting.
