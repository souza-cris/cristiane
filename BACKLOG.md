# Backlog

Work that is specified but not scheduled. Everything here is ready to pick up — the thinking
is done and written down, so resuming does not mean starting again.

Features under `specs/` are marked **Implemented** when they ship. Anything listed here is
marked **Backlog** in its own spec, so the two never disagree.

---

## 010 — Search visibility and domain migration

**State**: specified and planned. Nothing built.
**Deferred**: 26 July 2026, by the author — "let's do the SEO later".

[spec](specs/010-seo-and-domain-migration/spec.md) ·
[plan](specs/010-seo-and-domain-migration/plan.md) ·
[research](specs/010-seo-and-domain-migration/research.md) ·
[quickstart](specs/010-seo-and-domain-migration/quickstart.md)

Makes the site findable in search, gives shared links a proper preview card instead of a bare
address, and makes the later move to a custom domain a one-line change rather than a sweep.

**What is done**: the full spec (5 user stories, 26 requirements), the implementation plan,
seven research decisions, the data model, the contracts and the verification guide. Both open
questions were answered — the site will live at the **root** of the future domain, and the
preview image will be built from the existing site mark.

**What is left**: `/speckit-tasks`, then the build. Phase 1 only — Phase 2 cannot start until
a domain is actually bought.

**To resume**: run `/speckit-tasks`. The spec-kit pointer in `.specify/feature.json` already
targets this feature, so nothing needs setting up first.

### Two things not to lose

These came out of research and are the reason resuming will be quicker than starting over.

**The deploy workflow will silently defeat the migration if left as it is.**
`.github/workflows/pages.yml` builds with `--baseurl "/cristiane"` on the command line, and a
command-line flag beats `_config.yml`. Changing the base path in the config would therefore do
nothing, and every address on the site would be wrong in a way that only shows up once the
domain is live. Removing that flag is a Phase 1 task. See decision 2 in
[research.md](specs/010-seo-and-domain-migration/research.md).

**Old addresses may not redirect after the move, and that is not assumed.** GitHub does not
document what happens to `souza-cris.github.io/cristiane/…` once a custom domain is set — only
apex-vs-`www` redirects for the same domain are covered. The plan therefore relies on the
canonical address, which is under the site's control, and treats the redirect as something to
verify at migration time with a recorded fallback. See decision 4.

### Worth doing before this, if the chance arises

Not blocking, but they make the SEO work land better:

- **Two bookmarks link to `example.com`** and have done since the first build — "Designing for
  How People Learn" and "AI in Education". They are broken for visitors today, and once the
  site is indexed they become broken links a search engine has seen. `ruby tools/check-data.rb`
  lists them.
- **The "AI in Education" bookmark has no `source`**, reported by the same check.

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
