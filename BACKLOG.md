# Backlog

Work that is specified but not scheduled. Everything here is ready to pick up — the thinking
is done and written down, so resuming does not mean starting again.

A spec's `Status` is `Draft`, `Backlog`, `Active` or `Implemented`, and this file is kept in
step with it, so the two never disagree. Anything below is specified but not built.

**Nothing is currently backlogged.** Feature 010 was the last entry and shipped on 27 July
2026. What remains below are ideas with no spec.

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
