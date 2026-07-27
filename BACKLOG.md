# Backlog

Work that is specified but not scheduled. Everything here is ready to pick up — the thinking
is done and written down, so resuming does not mean starting again.

A spec's `Status` is `Draft`, `Backlog`, `Active` or `Implemented`, and this file is kept in
step with it, so the two never disagree. Anything below is specified but not built.

---

## ~~010 — Search visibility and domain migration~~ — ACTIVE AGAIN

**Taken off the backlog** on 27 July 2026: the author bought **crissouza.org**.
**State**: specified and planned, and now unblocked. Nothing built.

The domain is connected and serving over HTTPS — DNS points at GitHub Pages, the `CNAME` file
is committed, the certificate is issued and HTTPS is enforced. FR-027 required that before any
search work could be published, so the prerequisite is met.

The two phases have collapsed into one. Because the site was never indexed under the old
address, there is nothing to migrate — see the amendments in the spec, plan and research.
**The next step is `/speckit-tasks`.**

[spec](specs/010-seo-and-domain-migration/spec.md) ·
[plan](specs/010-seo-and-domain-migration/plan.md) ·
[research](specs/010-seo-and-domain-migration/research.md) ·
[quickstart](specs/010-seo-and-domain-migration/quickstart.md)

Makes the site findable in search, gives shared links a proper preview card instead of a bare
address, and makes the later move to a custom domain a one-line change rather than a sweep.

**What is done**: the full spec (5 user stories, 29 requirements), the implementation plan,
seven research decisions, the data model, the contracts and the verification guide. Both open
questions were answered — the site lives at the **root** of crissouza.org, and the preview
image will be built from the existing site mark.

**What is left**: `/speckit-tasks`, then the build. One phase — titles and descriptions,
canonical addresses, social preview tags, structured data, a sitemap and a robots file, and a
1200×630 preview image generated from the site mark.

**To resume**: run `/speckit-tasks`. The spec-kit pointer in `.specify/feature.json` already
targets this feature, so nothing needs setting up first.

### Two prerequisites, both already met

Both were raised in research as things that would bite later. Both were dealt with on 27 July
2026, before the domain went live, and are recorded here so nobody undoes them.

**The deploy workflow no longer forces the base path.** It used to build with
`--baseurl "/cristiane"`, and a command-line flag beats `_config.yml` — so changing the config
would have done nothing, and every address would have been wrong in a way only visible once the
domain was live. The flag is gone; `_config.yml` is the only place the address is declared.
Do not put it back. See decision 2 in
[research.md](specs/010-seo-and-domain-migration/research.md).

**The redirect question is moot.** Research decision 4 could not establish whether old
`souza-cris.github.io/cristiane/…` addresses would redirect after a custom domain was set —
GitHub does not document it. Connecting the domain before publishing any search work made the
question irrelevant: nothing was ever indexed under the old address, so nothing needs to
redirect away from it.

### Cleared beforehand

~~Two bookmarks linked to `example.com`, and one had no `source`.~~ **Done** — the bookmark
list was replaced with the author's own on 27 July 2026, and `ruby tools/check-data.rb` now
reports no problems.

---

## Ideas noted but not specified

Raised while doing other work and deliberately not pursued. No spec exists for any of these.

- **A page per publication.** Publications live as entries in `_data/research.yml` and render
  as one list, so they cannot each be found on their own terms. Giving each its own page would
  let individual work rank in search. Rejected inside feature 010 because it restructures the
  research section, which that feature put out of scope — but it is the single change most
  likely to help an academic site be found. See decision 5 in feature 010's research.
- **A web-based editor for content.** Considered when looking at easier ways to add stories and
  bookmarks, and set aside: a form-based CMS needs a large JavaScript bundle and an
  authentication service that GitHub Pages cannot host, which conflicts with three
  constitution principles. The templates and checker in `tools/` were built instead.
- **Comments on stories.** Asked for on 27 July 2026, after the first story was published, and
  parked rather than built. It is not a small addition. The site is static files on GitHub Pages
  with no server, so every option means a third-party script running on the page — the first
  thing here that would depend on somebody else at page load. It would need the constitution
  amended: Principle IV forbids requesting anything from an external host, and Principle V
  forbids JavaScript without a documented need.

  The options weighed, so they need not be re-derived:

  - **Giscus** — comments stored as GitHub Discussions in this repo. Free, no ads, no tracking,
    and the data stays with the author. Readers need a GitHub account, which for an academic
    audience is a real filter. Still loads a script from a CDN. The strongest candidate if this
    is ever built.
  - **Utterances** — the same idea on GitHub Issues. Lighter, older, same account requirement.
  - **A hosted service** — Commento or Hyvor take payment (~$5–10/month) and do not track;
    Disqus is free but ad-supported and watches readers closely, which cuts against the decision
    in feature 010 to leave analytics and trackers out.
  - **No comments** — point readers at LinkedIn, where the audience already is. Costs nothing,
    adds nothing, needs no moderation.

  The consideration most likely to decide it is not technical: comments need moderating. Spam
  finds static sites quickly, and an unmoderated comment section on a researcher's site ages
  badly.
