---
title: "GSoC 2026 with the United Nations: an OG-Core interface in MUIOGO"
date: 2026-09-20
categories: [gsoc, journey]
tags: [gsoc, gsoc-2026, united-nations, un-desa, muiogo, og-core, osemosys, clews, flask, javascript, frontend, open-source]
description: "My GSoC 2026 final report. What I built for the OG-Core interface in MUIOGO, and what's left to do."
---

<p align="center">
  <img src="/images/gsoc/gsoc-logo.svg" alt="Google Summer of Code" width="70%">
</p>

Google Summer of Code 2026 is done. I spent the summer with the United Nations Office of Information and Communications Technology, on a project owned by the Economic Analysis and Policy Division at UN DESA, and my work was the OG-Core side of a tool called MUIOGO.

MUIOGO is a browser interface for two open source policy models that UN DESA maintains. CLEWS covers climate, land, energy and water, so it tells a country whether a plan is physically possible, like whether there's enough land and water for a biofuel policy. OG-Core is an overlapping generations general equilibrium model, so it tells you what a tax or pension change does to growth and jobs across generations. Both have been used in more than 20 countries. CLEWS already had a UI. OG-Core didn't, and that was my project.

<!-- more -->

## What I worked on

| PR | What it does |
|---|---|
| [#492](https://github.com/EAPD-DRB/MUIOGO/pull/492) | The MUIOGO shell. Model selector, per-model menus, the OG calibration home |
| [#495](https://github.com/EAPD-DRB/MUIOGO/pull/495) | Install, update, add and remove a country calibration, with a live install log |
| [#522](https://github.com/EAPD-DRB/MUIOGO/pull/522) | Cases, parameters and run management |
| [#525](https://github.com/EAPD-DRB/MUIOGO/pull/525) | The results workspace |

That's about 22,000 lines across 147 files, and together they cover the whole OG-Core workflow. Pick a country, install it, create a baseline, add a reform on top, edit the parameters, queue the runs, read the results.

### Making room for a second model ([#492](https://github.com/EAPD-DRB/MUIOGO/pull/492))

MUIOGO only had a CLEWS interface, so before any OG-Core page could exist the app needed a way to hold two models at once. This PR is that shell.

- A two-button model selector in the header. Switching swaps the sidebar and the working area together.
- CLEWS mode is the existing interface, untouched and still on its own green accent.
- OG mode uses orange and opens a grid of country calibration cards, read live from the installer register.
- New styling is isolated in a new `muiogo.css`, and OG markup sits under a `.ogc-page` root, so MUIOGO still merges cleanly with its upstream.
- Country flags are vendored SVGs rather than CDN requests, since this tool gets used where the internet isn't a given.

### Installing a country without touching a terminal ([#495](https://github.com/EAPD-DRB/MUIOGO/pull/495))

OG-Core is calibrated per country, and each calibration is a separate Python package with its own environment. Before this, setting one up meant cloning a repo and building a venv by hand. This PR turns the calibration home into a working setup page.

- Install from the catalogue in one click, with the install log streaming while it runs.
- Add a calibration that isn't in the catalogue, from either a local folder or a Git URL.
- A background update check, so an "update available" badge appears where upstream has moved ahead.
- Remove a calibration, which de-registers it inside MUIOGO and leaves the files on disk.
- Verified against the real backend rather than mocks. Ethiopia and South Africa from the catalogue, OG-USA from a Git URL, each producing an environment whose own Python imports the package.

### Building a scenario and running it ([#522](https://github.com/EAPD-DRB/MUIOGO/pull/522))

This is the modelling workflow and the core of the project. A baseline is a reference run, a reform is measured against it, and this PR covers everything from creating those to getting a solve out.

- Create, edit, duplicate and delete baselines and reforms.
- A parameter editor built on Tabulator, with the model's own defaults layered underneath your overrides.
- A run queue with live worker logs, cancellation and run history.
- Progress shows the stage, meaning steady state and then transition path, plus the iteration count. OG-Core doesn't know its own percentage, so a progress bar would only be a guess.
- Guards instead of late errors. A reform whose baseline has no results can't be run, and the row says why rather than failing halfway through.

### Reading what came out ([#525](https://github.com/EAPD-DRB/MUIOGO/pull/525))

A finished run leaves a folder of result files on disk. This PR is the page that turns them into something an economist can actually compare.

- Pick a baseline run and a reform run and see them against each other.
- Charts on Apache ECharts, written as a model-neutral renderer instead of an OG-only one.
- Analysis tables with export.
- ECharts replaced two commercial charting libraries the old viewer depended on, which I'd raised as an issue early in the summer.

Issues I raised along the way: [#490](https://github.com/EAPD-DRB/MUIOGO/issues/490), [#491](https://github.com/EAPD-DRB/MUIOGO/issues/491), [#494](https://github.com/EAPD-DRB/MUIOGO/issues/494), [#500](https://github.com/EAPD-DRB/MUIOGO/issues/500), [#501](https://github.com/EAPD-DRB/MUIOGO/issues/501), [#521](https://github.com/EAPD-DRB/MUIOGO/issues/521), [#524](https://github.com/EAPD-DRB/MUIOGO/issues/524) and [#528](https://github.com/EAPD-DRB/MUIOGO/issues/528). All the work is on [EAPD-DRB/MUIOGO](https://github.com/EAPD-DRB/MUIOGO).

## How it fits together

<img src="/images/gsoc/muiogo-architecture.svg" alt="MUIOGO architecture: browser shell with CLEWS and OG-Core pages, an Ogc API wrapper, Flask, OG-Core services, and the worker process running in the country calibration venv" width="100%">

The part worth knowing is that a solve doesn't run inside Flask. Each installed country gets its own virtual environment, and the worker process starts with that interpreter, so the model code never gets imported into the web app. File ownership is split too. MUIOGO owns the run metadata and the log, the worker owns the status file and the results, and a run only counts as finished when the worker exits cleanly.

## The workflow

<img src="/images/gsoc/muiogo-journey.svg" alt="Workflow from Home to Cases to Parameters to Run to Results, with a lane for guards and failure states" width="100%">

Every completed run stores a fingerprint of its inputs, so changing a parameter invalidates that run's results, and rerunning a baseline invalidates every reform sitting on top of it. The bottom lane of the diagram is where that gets enforced. Working out that these were real constraints and not details I could skip took me a while.

<p align="center">
  <img src="https://github.com/user-attachments/assets/04a5d8d0-a918-4f6b-97e6-6887c4295b93" width="49%">
  <img src="https://github.com/user-attachments/assets/b88cea86-0b7a-4930-809f-30289313826a" width="49%">
  <img src="https://github.com/user-attachments/assets/53bc1f03-b638-483d-a8e8-3e4450e4fc96" width="49%">
  <img src="https://github.com/user-attachments/assets/0ec5e5b0-d2e6-48b0-be7b-d96f6d16bbb5" width="49%">
</p>

*Cases, parameters, a run in progress, and results.*

## What's left to do

The full project is four deliverables. A cross-platform baseline, OG-Core on its own, coupled one-way runs where one model's output feeds the other, and a converging workflow that iterates both until the answers stop moving. My summer was the second one.

Coupled mode is the next piece of UI work. You run CLEWS, turn what the energy and land and water system did into the fiscal inputs OG-Core understands, and run OG-Core on top. Then the other direction. The hard part isn't the running, it's the translation, because the two models have different output shapes, different units and different time resolution. So the set of bridge variables has to be agreed first. After that it needs a guided run rather than one button, with the exchanged values shown at each handoff so an analyst can check them, and a combined view of the physical and fiscal side of the same scenario.

Then converging, which is the same thing in a loop until the numbers settle. The interesting design problem there is showing distance to tolerance per iteration, so you can see whether it's converging or stuck and stop it early. Packaging the app into a downloadable installer per platform is also still ahead.

## Thanks

<p align="center">
  <img src="/images/gsoc/meeting.jpg" alt="A MUIOGO team video call with four participants" width="88%">
</p>

*One of our weekly calls.*

Thanks to Alfonso and Marcelo for reviewing carefully, and to Aditya for the backend I spent four months calling. My favourite part was that this wasn't a demo. The models get used by economists in developing countries to test real fiscal and climate policy, and the work carries on past GSoC through UN DESA's country programmes.
