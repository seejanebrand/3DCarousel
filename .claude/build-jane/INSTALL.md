# Installing /build-jane

The command works two ways.

**Project scoped.** Already active. `.claude/commands/build-jane.md` in this
repo makes `/build-jane` available whenever Claude Code runs with this repo as
the working directory. Nothing to install.

**User scoped.** Makes `/build-jane` available in every repo and every session,
including fresh cloud containers, which start empty.

```sh
sh .claude/build-jane/install.sh
```

That copies `commands/build-jane.md` to `~/.claude/commands/` and the
`build-jane/` support tree to `~/.claude/build-jane/`, then runs the self-test.

Cloud sessions are ephemeral. Anything written to `~/.claude` disappears when
the container is reclaimed. This repo is the durable copy, which is why the
install runs from here rather than the other way round.

## Verify

```sh
node ~/.claude/build-jane/scripts/jane.mjs self-test
```

Six negative controls. Each machine check is run against a fixture it must fail
on. A clean audit means nothing until this passes.

## Where Janes live

`./janes/<slug>/` under whatever directory you run from. Override with
`BUILD_JANE_ROOT`. Keep Janes in their own repo or working directory. This repo
holds the framework, not the Janes built with it.
