---
layout: story
title: "Building a webpage with spec-driven development"
date: 2026-07-25
keywords: [isd, ai]
tags: [spec-driven-development, spec-kit, jekyll, ai, web development]
tldr: "How I built this site by writing the spec first and letting an AI agent implement it, one small feature at a time. Draft, still filling in the details."
---

<!--
DRAFT NOTES (delete before publishing):
Anywhere you see [FILL IN: ...] is a spot for your own words, a screenshot,
a real example, or a link. Everything else is a first pass you can rewrite.
-->

I am new to web development, so building my own site could have gone one of two ways: a pile of half-finished HTML I did not understand, or a slower, more deliberate approach where I said what I wanted before anything got written. I went with the second one. This is a short account of building this site with spec-driven development, and what it was actually like.

## What spec-driven development means

The idea is simple. Instead of jumping straight into code, you first write a specification: a plain-language description of what a feature should do, who it is for, and how you will know it works. The code comes after, and it has to satisfy the spec. The spec is the source of truth, not the code.

For me the appeal was control. [FILL IN: one or two sentences on why this mattered to you personally, e.g. wanting to learn as you go, not wanting to depend on code you could not read, keeping the project maintainable by one person.]

## The tools I used

I used [Spec Kit](https://github.com/github/spec-kit), an open toolkit for spec-driven development, together with an AI coding agent. Spec Kit gives you a set of commands that walk you through the workflow, and the agent does the writing while I stayed in charge of the decisions.

The pieces:

- A **constitution** file that holds the rules the whole project has to follow. Mine says things like keep it simple, keep all content in data files, stay compatible with GitHub Pages, and avoid JavaScript unless there is a real need.
- A **spec** for each feature, describing the behavior in plain language.
- A **plan** and a **task list** generated from the spec.
- The **implementation**, checked against the spec.

[FILL IN: which editor and agent you settled on, and one line on why. e.g. running it inside VS Code, or from the terminal.]

## How a feature actually got built

The workflow repeats for every feature, and that repetition is the point. Here is roughly how one went.

First I wrote the constitution once, at the start, so every later decision had something to answer to.

Then, for each new piece of the site, I described what I wanted in a spec. For example, when I turned my old about page into a visual timeline of my career, the spec said the track should run oldest to newest, show a logo and a country flag for each stop, and never show years, because the order is the story. Writing that down first forced me to decide what the feature really was before a single line of layout existed.

From the spec came a plan and a list of tasks, and then the agent implemented them. Because the spec was specific, I could check the result against it instead of guessing whether it was "done." [FILL IN: a concrete moment here. Did the first attempt miss something? Did writing the spec change your mind about the design? A screenshot of the feature would be great.]

I built the site this way one feature at a time: [FILL IN: list the ones you want to mention, e.g. the initial site, the dark theme, the content restructure, the journey timeline and search. You can name the ones you are proud of.]

## What worked

The biggest surprise was how much clearer my own thinking got. When you have to write down what "good" looks like before you build, you catch bad ideas early, on a page of text instead of in a tangle of code. [FILL IN: a specific example of a decision you got right because you specified it first.]

It also made working with an AI agent far less chaotic. The spec gave the agent a target and gave me a way to say "this does not match what I asked for" with something concrete to point at. [FILL IN: your take on the human and agent split of labor, since this is close to what you research.]

## What was harder than expected

I want to be honest about the friction, not just sell the method. [FILL IN: the real trade-offs you felt. Some candidates: writing a good spec takes time up front; it can feel slow for tiny changes; you still have to understand enough to judge the output; the tooling had a learning curve. Pick the ones that were actually true for you.]

## Would I do it again

[FILL IN: your honest answer. Who is this worth it for, and who is it not worth it for? What would you tell someone starting their own site?]

---

[FILL IN: optional closing line, and any links you want, e.g. to the repo, to the journey page, or to a specific spec.]
