---
title: "GSoC 2026 final report: building the OG-Core interface in MUIOGO"
date: 2026-09-20
categories: [gsoc, journey]
tags: [gsoc, gsoc-2026, united-nations, un-desa, muiogo, og-core, osemosys, clews, flask, javascript, frontend, open-source]
description: "My GSoC 2026 final report for the United Nations. What I shipped in MUIOGO, what I got wrong, and why the convergence phase is still ahead."
---

<p align="center">
  <img src="/images/gsoc/gsoc-logo.svg" alt="Google Summer of Code" width="70%">
</p>

This is my final report for Google Summer of Code 2026. I worked with the United Nations Office of Information and Communications Technology on a project owned by the Economic Analysis and Policy Division at UN DESA, and my job was the frontend and software engineering side of a tool called MUIOGO.

Short version of what MUIOGO is. UN DESA maintains two open source policy models. CLEWS looks at climate, land, energy and water, so it tells a country whether a plan is physically possible, like whether there's actually enough land and water for a biofuel policy. OG-Core is an overlapping generations macroeconomic model, so it tells you what a tax or pension change does to growth and jobs across generations. Both are mature. Both have been used in more than 20 countries. And until this year they didn't talk to each other, and only one of them had a browser interface.

My deliverable was the second of four. Give OG-Core the same level of browser support CLEWS already had, inside the same app, without breaking CLEWS.

<!-- more -->

## What shipped

| PR | What it does | Size |
|---|---|---|
| [#492](https://github.com/EAPD-DRB/MUIOGO/pull/492) | The MUIOGO shell. Model selector, per-model menus, OG calibration home, Playwright smoke test in CI | +772 / -26, 27 files |
| [#495](https://github.com/EAPD-DRB/MUIOGO/pull/495) | Install, update, add and remove a country calibration, with a live install log | +1,062 / -57, 6 files |
| [#522](https://github.com/EAPD-DRB/MUIOGO/pull/522) | Cases, parameters and run management. Baselines, reforms, the parameter editor, the run queue | +8,777 / -262, 51 files |
| [#525](https://github.com/EAPD-DRB/MUIOGO/pull/525) | The results workspace. Charts, comparison, tables, export | +11,628 / -262, 63 files |

That's roughly 22,000 lines across 147 files, and it covers the whole OG-Core workflow. Pick a country, install it, build a baseline, add a reform on top, edit its parameters, queue the runs, read the results.

Issues I raised along the way, since some of them turned into other people's work: [#490](https://github.com/EAPD-DRB/MUIOGO/issues/490) on the licence problem in the old visualisation stack, [#491](https://github.com/EAPD-DRB/MUIOGO/issues/491), [#494](https://github.com/EAPD-DRB/MUIOGO/issues/494), [#500](https://github.com/EAPD-DRB/MUIOGO/issues/500) where the OG data folder was showing up as a CLEWS model, [#501](https://github.com/EAPD-DRB/MUIOGO/issues/501) on install jobs not being visible in the registry, [#521](https://github.com/EAPD-DRB/MUIOGO/issues/521), [#524](https://github.com/EAPD-DRB/MUIOGO/issues/524) and [#528](https://github.com/EAPD-DRB/MUIOGO/issues/528).

Two of those are worth calling out because Aditya fixed them on the backend. #500 became his [#502](https://github.com/EAPD-DRB/MUIOGO/pull/502) and #501 became his [#503](https://github.com/EAPD-DRB/MUIOGO/pull/503). The second one matters to me because my frontend was carrying a localStorage workaround for exactly that gap, and once his PR landed the workaround stopped being the only option.

All work is on `EAPD-DRB/MUIOGO`. My fork only ever held two throwaway CI dry-runs, so don't look there.

## The shape of the thing

Here's what the OG side actually looks like now.

<img src="/images/gsoc/muiogo-architecture.svg" alt="MUIOGO architecture: browser shell with CLEWS and OG-Core pages, an Ogc API wrapper, Flask, OG-Core services, and the worker process running in the country calibration venv" width="100%">

*The two-model shell and the OG-Core stack. Component boxes link to the real files at revision `a875cdc3`.*

The bit I want to point at is the right hand side. A solve doesn't run inside Flask. `OGRunner` starts `ogc_worker.py` using the Python interpreter that belongs to the selected country calibration, because OG-USA and OG-ETH and OG-ZAF each get their own virtual environment under `~/.muiogo/og-models`. So the model code never gets imported into the web app at all. File ownership is split too, and this took me a while to internalise. MUIOGO owns `run_meta.json` and `run_log.txt`. The worker owns `run_status.json` and the result files. A run is only finished when the worker exits cleanly and writes a successful terminal status, not when the process ends.

## Why the switch is in the header

My first cut put OG-Core inside the existing CLEWS menu. Alfonso pushed back on that, and he was right. OG-Core isn't a page inside CLEWS, it's a peer, so the entry point belongs in a top level switch.

So #492 rebuilt it as a shell. There's a two-button model selector in the header that's always visible, and switching replaces the sidebar and the working area together. CLEWS mode is the existing MUIO interface, untouched, still on its own green accent. OG mode uses orange and opens the calibration home, which is a card grid of countries read live from the installer register.

<p align="center">
  <img src="https://github.com/user-attachments/assets/967f2feb-df78-4e82-a83c-2b5f2eff08ee" width="48%">
  <img src="https://github.com/user-attachments/assets/7cfd9041-bb39-42bb-b313-d92d5669dba5" width="48%">
</p>

*The model pick screen and the OG calibration home, from PR #492.*

The thing I'm most pleased about here isn't visible in a screenshot. MUIOGO is downstream of OSeMOSYS/MUIO, so anything I do has to keep future upstream syncs mergeable. All the new styling lives in a new `muiogo.css`, all the shell logic lives in a new `MuiogoShell` class, and the only upstream files I edited are `Navbar.html`, `Sidebar.html`, `Routes.Class.js` and `index.html`, each with a small marked insertion point. OG markup sits under a `.ogc-page` root with `.ogc-*` class names and nothing else. It's a UI island. If someone rebases MUIO 5.7 onto this next year, they should barely notice me.

I also vendored the country flags as SVGs from flag-icons (MIT, licence included) rather than pulling them from a CDN, so the app still works with no internet. Small thing. But this tool gets used in places where the internet is not a given, and that's sort of the whole point of the project.

## The install lifecycle, and the review that fixed it

PR #495 turned that home page into something that does work. You can install a country from the catalogue in one click and watch the log stream while it runs. You can add a calibration that isn't in the catalogue from a local folder or a Git URL, and the dialog runs the backend's check first and shows you what it found before anything gets installed. Updates get checked in the background when the page opens, so an "update available" badge turns up where upstream has moved ahead. And you can remove one, which de-registers it in MUIOGO while leaving the files on disk.

<p align="center">
  <img src="https://github.com/user-attachments/assets/469fe319-e4ab-46b3-8aa5-c3f9e19c55ec" width="48%">
  <img src="https://github.com/user-attachments/assets/3a69c5f4-4afd-434b-b7fe-442b2f8964f9" width="48%">
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/d9b8ad4a-a420-48ae-8048-f09f68ec6e00" width="48%">
  <img src="https://github.com/user-attachments/assets/2ff1fd42-6282-4af5-ae22-a3e77b8dbc3c" width="48%">
</p>

*Install with a live log, the add-calibration dialog, the error view, and the update badge. From PR #495.*

Now the honest part. I thought this PR was done, and Alfonso came back with four state machine bugs.

1. I was showing an Update button for calibrations added from a local folder, and the backend refuses to update those. Dead control.
2. After the Add form passed its check, you could edit the source or the label and still hit Add, so you'd install something that was never checked.
3. Reopening a failed install showed the wrong dialog. The card said failed but my model still held the old state, so the log came back claiming it was still running, with no Retry.
4. Polling could restart after you'd left the page, because a late API response came back and started it again.

Every one of those is a state bug, not a styling bug. And the fix was to stop treating the card as a set of independent booleans and write down the actual state machine, which is this.

<img src="/images/gsoc/muiogo-lifecycle.svg" alt="Lifecycle diagram of a calibration: not installed, installing, installed, update available, removed, with install failure and retry, and a solve that holds the environment" width="100%">

*A calibration's life, and the run that locks it.*

The interlock in the middle band is the part I didn't expect going in. A solve holds the country environment while it runs, so an install or an update on that country has to wait for it, and a run can't start while that environment is being installed. It goes both ways. On top of that, interrupted runs get marked failed when the app starts up, and a matching orphaned worker gets terminated if one is found.

One more thing I like about this PR. An install keeps running in the backend even if you reload the browser, and to keep the live log visible across a reload I stored the job id in localStorage and resumed from it. That was a frontend workaround for a backend gap, I said so in the PR body rather than pretending it was a design, and I raised #501 for the real fix. Aditya's #503 then made jobs registry-tracked. I'd rather ship an honest workaround with the proper issue filed than a quiet hack.

I verified all of it against the real backend, not mocks. Installed Ethiopia and South Africa from the catalogue and OG-USA from a Git URL, and each one gave a working environment whose own Python imports the package (ogeth 0.1.0, ogzaf 0.2.0, ogusa 0.4.0, all on ogcore 0.16.3). For the update flow I wound the Ethiopia clone back a commit and the check caught it.

## Cases, parameters, runs

This is the biggest PR of the four and the one where I learned the most domain vocabulary.

I'd been calling things scenarios. Economists call them cases. A baseline is the reference run, a reform is measured against it, and a reform's results are only valid while its baseline's results are still current. That last bit isn't cosmetic. Change a parameter and that run's results are invalid. Rerun a baseline and every reform sitting on top of it goes stale. The run layer also rejects a reform whose `S`, `T`, `J`, `M` or `I` dimensions don't match its baseline, so you can't accidentally compare two different model shapes.

<img src="/images/gsoc/muiogo-journey.svg" alt="Workflow from Home to Cases to Parameters to Run to Results, with a guard lane for disabled controls and failure states" width="100%">

*What an analyst walks through once a country is installed. The bottom lane is where the UI says no.*

That bottom lane is the design idea I'd defend hardest. Every guard is a disabled control with a reason attached, not an error thrown after the fact. A reform whose baseline has no results can't be selected, and the row tells you why. A selected run whose inputs haven't changed says it'll use the cached result, and there's a single toggle to force a re-run anyway.

<p align="center">
  <img src="https://github.com/user-attachments/assets/04a5d8d0-a918-4f6b-97e6-6887c4295b93" width="80%">
</p>

*The Ethiopia cases workspace.*

<p align="center">
  <img src="https://github.com/user-attachments/assets/b88cea86-0b7a-4930-809f-30289313826a" width="80%">
</p>

*The parameters page. Tabulator 6.5.0, MIT, vendored with its licence.*

And progress. I refuse to show a percent bar for an OG-Core solve, because OG-Core doesn't know its own percentage and any number I put there would be a lie. So the run page shows the stage (steady state, then transition path) and the iteration count, and nothing else. When a solve doesn't converge it's reported as a finding with OG-Core's own message, not as a raw stack trace. Cancel stops the whole worker process tree.

<p align="center">
  <img src="https://github.com/user-attachments/assets/53bc1f03-b638-483d-a8e8-3e4450e4fc96" width="80%">
</p>

*A reform running, with live worker log output.*

## Results

PR #525 is the results workspace. You pick a baseline run and a reform run, and you get charts, comparison views and analysis tables with export.

<p align="center">
  <img src="https://github.com/user-attachments/assets/0ec5e5b0-d2e6-48b0-be7b-d96f6d16bbb5" width="80%">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/58b3d96f-83a7-4fd4-8182-50059e8a2c49" width="80%">
</p>

*Results overview and the analysis tables.*

The library choice here came out of an issue rather than a preference. The old result viewer used Wijmo and jQWidgets, both commercial, which I flagged as #490 early on because a UN tool that gets handed to ministries can't ship on a licence nobody can audit. So Results uses Apache ECharts 6.1.0 under Apache 2.0, vendored with its licence and notice files, and it's written as a model-neutral renderer rather than an OG-only one. The CLEWS side is moving off Wijmo too, which is a better outcome than the one I was asking for.

## What comes next, coupled then converging

<img src="/images/gsoc/muiogo-roadmap.svg" alt="Four phase roadmap across two lanes, meeting at Schema v1 and Schema v2, ending in the convergence loop" width="100%">

*Four phases, two lanes, and the two contracts where they meet.*

The full project is four deliverables. A cross-platform baseline, then OG-Core on its own, then coupled one-way runs where one model's output feeds the other, and finally a converging workflow that keeps iterating both models until the answers stop moving. My summer was the second one. Coupled is the next piece of UI work and it's the one I'd want to build.

Here's what coupled means in practice. You run CLEWS, take what the energy and land and water system actually did, turn those physical results into the fiscal inputs OG-Core understands, and run OG-Core on top of them. Then the other direction, where OG-Core's macro path feeds back into the CLEWS assumptions. One way each time, no loop yet. And the hard part isn't the running. It's the translation, because the two models have different output shapes, different units and different time resolution. So the set of bridge variables has to be agreed before anyone writes a line of UI, and that agreement is Schema v2.

Some of the plumbing is already there. Marcelo landed the apply-patch endpoint and the post-run coupled-run hook in [#520](https://github.com/EAPD-DRB/MUIOGO/pull/520), so patching one model's inputs from another model's outputs is a thing the backend can do.

What I think the coupled UI needs. A guided run rather than one button, because a coupled run is stages and the user should see which stage they're in and what got handed across. Validation at each handoff, with the exchanged values on screen so an analyst can sanity check them instead of trusting a black box. The intermediate artifacts kept and downloadable, because in policy work somebody will eventually ask where a number came from. And a combined results view that puts the physical and the fiscal side of the same scenario together.

Then converging. Same thing in a loop, until the numbers settle. The interesting design problem there is the loop view, and it isn't a spinner. You want distance to tolerance per iteration, drawn as a line walking towards the threshold, so you can see whether it's converging or stuck or oscillating, and kill it early if it's clearly going nowhere. Configurable tolerance and a maximum iteration count.

The two lanes in that diagram only ever meet at contracts, and that's the thing I'd tell whoever picks this up. Schema v1, the OG-Core results shape, unblocked my results page and Aditya's runner at the same time back in June. Schema v2 does the same job for coupled mode. Everything else we built in parallel, me against a mock and him against the real model, and it worked because we agreed the shape of the data before either of us wrote to it.

Packaging is still ahead too. I added the Playwright shell smoke test and the e2e CI job, and the solver resolution chain and the uv migration came from Marcelo and Utshant, so the app is a lot more portable than it was in May. Turning that into a downloadable installer per platform is the piece that's left.

## On the review process

I got a lot of changes-requested on this project and it made the work better. Alfonso reviews properly, which means he finds the state bug you talked yourself out of caring about. #492 went through a five point review and a separate documentation ask before he approved it. #495 went through two rounds.

The rule I settled into was that a PR body only claims what I actually tested. If I verified something against the real backend I said which countries and which versions. If a fix was a workaround I said it was a workaround and linked the issue for the real thing. It's slower to write and it saves an entire round of review, because the reviewer doesn't have to work out which of your claims to trust.

## Links

- Repository: [EAPD-DRB/MUIOGO](https://github.com/EAPD-DRB/MUIOGO)
- My pull requests: [#492](https://github.com/EAPD-DRB/MUIOGO/pull/492), [#495](https://github.com/EAPD-DRB/MUIOGO/pull/495), [#522](https://github.com/EAPD-DRB/MUIOGO/pull/522), [#525](https://github.com/EAPD-DRB/MUIOGO/pull/525)
- My issues: [#490](https://github.com/EAPD-DRB/MUIOGO/issues/490), [#491](https://github.com/EAPD-DRB/MUIOGO/issues/491), [#494](https://github.com/EAPD-DRB/MUIOGO/issues/494), [#500](https://github.com/EAPD-DRB/MUIOGO/issues/500), [#501](https://github.com/EAPD-DRB/MUIOGO/issues/501), [#521](https://github.com/EAPD-DRB/MUIOGO/issues/521), [#524](https://github.com/EAPD-DRB/MUIOGO/issues/524), [#528](https://github.com/EAPD-DRB/MUIOGO/issues/528)
- Architecture notes in the repo: `docs/ARCHITECTURE.md`
- OG-Core (reference: https://github.com/PSLmodels/OG-Core) and OSeMOSYS (reference: https://github.com/OSeMOSYS/OSeMOSYS)

Thanks to Alfonso and Marcelo for reviewing carefully instead of quickly, to Aditya for building the backend I spent four months calling, and to Utshant for the CLEWS side fixes. The work carries on past GSoC through UN DESA's country programmes, which is a strange and good feeling for a summer project.
