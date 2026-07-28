---
layout: story
title: "Old wine in a new bottle? Playing with spec-driven development"
date: 2026-07-26
keywords: [leadership, isd]
tags: [spec-driven development, spec kit, claude code, ai, github]
description: "I built this site with spec-driven development, using Spec Kit and Claude Code. The structure and documentation impressed me. The rigidity did not."
image: "/assets/img/stories/old-wine/old-new-bottle.jpg"
tldr: "I built this site with spec-driven development using Spec Kit and Claude Code. The structure and documentation impressed me, the rigidity did not, and a lot of it felt familiar to anyone who has managed a project."
---

<figure class="story-figure story-figure--light">
  <img src="{{ '/assets/img/stories/old-wine/old-new-bottle.jpg' | relative_url }}" alt="A bottle labelled OLD pouring its contents into a bottle labelled NEW." width="547" height="775" loading="lazy">
</figure>

It was in my backlog for the summer: create a personal website. I wanted to learn about spec-driven development (SDD), so I built it (yeah, this site) with SDD.

## What is SDD?

One might say that spec-driven development (SDD) is the “new agile” or the “new SDLC” in the age of AI. It is a process, indeed, that uses the specification as a base. SDD works in phases: (a) specify, (b) plan, (c) tasks, (d) implement.

## What I did

I used [Spec Kit](https://github.com/github/spec-kit), an open toolkit for spec-driven development, together with Claude Code as the AI coding agent. Spec Kit gives you a set of commands that walk you through the workflow, and the agent does the writing while I stayed in charge of the decisions.

The pieces:

- A **constitution** file that holds the rules the whole project has to follow. Mine says things like keep it simple, keep all content in data files, stay compatible with GitHub Pages, and avoid JavaScript unless there is a real need.
- A **spec** for each feature, describing the behavior in plain language.
- A **plan** and a **task list** generated from the spec.
- The **implementation**, checked against the spec.

It is not my first time developing a website (it is the second hehehe). I used GitHub with Claude and VS Code in the first one, so I decided to go with a similar setup. GitHub has a framework called “Spec Kit”. I asked Claude to help me set up everything.

I started with the Spec Kit on the console, using Claude Code, but I got bored of it and moved to VS Code, still with Claude Code.

<figure class="story-figure">
  <img src="{{ '/assets/img/stories/old-wine/spec-kit-ready.png' | relative_url }}" alt="Claude Code confirming Spec Kit initialised cleanly, with every step green and the speckit command names listed." width="1200" height="284" loading="lazy">
</figure>

<aside class="tbh"><p><strong>#tbh:</strong> Why Claude? In the beginning I had ChatGPT for free, then I tested Gemini, Copilot, and Claude. The free version was not enough for me, so I started paying for ChatGPT. But then I stopped and moved to Claude. Ok, it feels like Groundhog Day. I am not going to pay for a thousand AIs like I pay for Netflix, Apple, Prime Video, etc. This is why I use Claude.</p></aside>

Back to what matters, project ready, let’s go step by step of how I developed my first feature:

<p class="story-command">/speckit-constitution</p>

This phase sets the principles. I typed the principles below (created with Claude’s help) and it created my constitution. The constitution is used by the entire project, not only the first feature.

> This is a personal website for Cristiane, built as a Jekyll static site hosted on GitHub Pages.
>
> Principles:
>
> - Keep it simple and maintainable. Prefer clear, conventional code over clever solutions.
> - All content (blog posts, projects, curation items) lives in easy-to-edit Markdown or data files, never hardcoded in HTML.
> - The site must build with Jekyll and work on GitHub Pages for free.
> - Pages must be fast, mobile-friendly, and accessible.
> - Minimal JavaScript; only add it when there is a clear need.
> - Always test locally with `bundle exec jekyll serve` before pushing.
> - I am new to this, so explain what you change and why as you go, in plain language.

<aside class="tbh"><p><strong>#tbh:</strong> Does it sound like something we, ex and current project managers, know very well?</p></aside>

<p class="story-command">/speckit-specify</p>

After a chat with Claude about the type of website I wanted, we ended up with: "Build a personal website for Cristiane as a Jekyll static site hosted on GitHub Pages with five sections: Home, Portfolio/Resume, Projects, Blog, and Curation."

It created a whole spec with 5 user stories. Each one with priority and acceptance scenarios:

<figure class="story-figure">
  <img src="{{ '/assets/img/stories/old-wine/first-user-story.png' | relative_url }}" alt="The generated spec showing User Story 1, Home Page and Site Navigation, with its priority, independent test and four acceptance scenarios." width="1200" height="684" loading="lazy">
</figure>

<aside class="tbh"><p><strong>#tbh:</strong> The user story format is not exactly what I am used to, but it is not bad, considering that people don’t really follow the user story “traditional” format anyway…</p></aside>

Besides that, the spec also included edge cases, requirements, and success criteria.

And this is how my first feature was created.

<p class="story-command">/speckit-plan</p>

Claude told me: “Next is the planning step, where the AI decides the technical structure. The plan is the blueprint everything else follows.”

<figure class="story-figure">
  <img src="{{ '/assets/img/stories/old-wine/site-built.jpg' | relative_url }}" alt="Claude Code listing the site structure it built — config, layouts, includes, pages and assets — and the commit that followed." width="1200" height="573" loading="lazy">
  <figcaption>“Big milestone: Claude Code built the entire site, all five sections, with the correct structure.”</figcaption>
</figure>

<aside class="tbh"><p><strong>#tbh:</strong> Here is when I got lost. I am not an engineer and if this was something more critical, I wouldn’t know what to do. Is this the correct structure? I had to trust Claude on this…</p></aside>

<p class="story-command">/speckit-implement</p>

It validates against the spec.

After implementing the first feature, I decided to move to VS Code, so the other features were all created through VS Code with Claude Code CLI.

<aside class="tbh"><p><strong>#tbh:</strong> Following the spec-kit was kinda hard for me, not because I couldn’t understand, but I thought it was too rigid. I also felt like it was limiting my creativity. Of course, this example does not reflect a real-world use case. There is no impact, no dependency with other teams or legacy systems, no risk.</p></aside>

## Discussion

I like how structured the artifacts are now with my 10 features. How it always goes back to the constitution, constantly checking against the principles. How it validates if there is any dependency between stories and tasks, or even features (when I got excited with the project and asked so many things it had to break down into more than one feature). It has a lot of documentation on my repo. I was not expecting that.

Basically, this is the process:

<ol class="process">
  <li class="process__step">
    <span class="process__num">1</span>
    <span class="process__name">Specify</span>
    <span class="process__desc">The what and the why</span>
  </li>
  <li class="process__step">
    <span class="process__num">2</span>
    <span class="process__name">Plan</span>
    <span class="process__desc">The how, technically</span>
  </li>
  <li class="process__step">
    <span class="process__num">3</span>
    <span class="process__name">Tasks</span>
    <span class="process__desc">The work, step by step</span>
  </li>
  <li class="process__step">
    <span class="process__num">4</span>
    <span class="process__name">Implement</span>
    <span class="process__desc">Build it, check the spec</span>
  </li>
</ol>

So, what is really new?

Many questions are on my mind right now, and they could be the starting point for the next post:

- How does the team divide the work?
- Who is responsible for managing the backlog of features?
- What is the recommended size of a spec?
- How do different coding agents use this process? Do they use the same language?
- How does the heavy documentation help?
- Who writes the spec? What if I write it wrong?
- So are we supposed to spec everything beforehand???
