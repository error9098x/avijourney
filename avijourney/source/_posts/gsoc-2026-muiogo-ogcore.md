---
title: "GSoC 2026 with the United Nations: an OG-Core interface in MUIOGO"
date: 2026-09-20
categories: [gsoc, journey]
tags: [gsoc, united-nations, muiogo, og-core, open-source]
description: "My GSoC 2026 final report. Building the OG-Core interface in MUIOGO for UN DESA, and what's left to do."
---

<p align="center">
  <img src="/images/gsoc/gsoc-logo.svg" alt="Google Summer of Code" width="70%">
</p>

Google Summer of Code 2026 is done. I spent the summer with the [United Nations Office of Information and Communications Technology](https://unite.un.org/), on a project owned by the Economic Analysis and Policy Division at [UN DESA](https://www.un.org/en/desa), and my work was the OG-Core side of a tool called [MUIOGO](https://github.com/EAPD-DRB/MUIOGO).

MUIOGO is a browser interface for two open source policy models. [CLEWS](https://github.com/OSeMOSYS/OSeMOSYS) covers climate, land, energy and water, so it tells a country whether a plan is physically possible, like whether there's enough land and water for a biofuel policy. [OG-Core](https://github.com/PSLmodels/OG-Core) is an overlapping generations general equilibrium model, so it tells you what a tax or pension change does to growth and jobs across generations. Both have been used in more than 20 countries.

<!-- more -->

Three things feed into MUIOGO, which is worth getting straight before anything else.

<img src="/images/gsoc/muiogo-upstream.svg" alt="OG-Core is calibrated per country into OG-ETH, OG-ZAF and OG-USA, which MUIOGO installs at runtime. MUIOGO is forked from OSeMOSYS and MUIO" width="100%">

OG-Core itself is generic. A country becomes usable by calibrating it, which produces a separate Python package like `OG-ETH` for Ethiopia or `OG-ZAF` for South Africa, each pinned to its own OG-Core version. MUIOGO is downstream of [MUIO](https://github.com/OSeMOSYS/MUIO), the existing OSeMOSYS interface, so anything I write has to keep future upstream syncs mergeable. CLEWS already had a UI through that lineage. OG-Core had none, and that was my project.

## What I worked on

| PR | What it does |
|---|---|
| [#492](https://github.com/EAPD-DRB/MUIOGO/pull/492) | The MUIOGO shell. Model selector, per-model menus, the OG calibration home |
| [#495](https://github.com/EAPD-DRB/MUIOGO/pull/495) | Install, update, add and remove a country calibration, with a live install log |
| [#522](https://github.com/EAPD-DRB/MUIOGO/pull/522) | Cases, parameters and run management |
| [#525](https://github.com/EAPD-DRB/MUIOGO/pull/525) | The results workspace |

Taking one policy question end to end shows what those four add up to. Say you want to know what raising Ethiopia's effective corporate tax rate does to the economy. You install the `OG-ETH` calibration, which arrives with the country's own estimated defaults. You create a baseline, which is a run of the economy as calibrated, with nothing changed. Then you create a reform on top of it and edit one parameter, `adjustment_factor_for_cit_receipts`, the factor that lifts the statutory corporate rate to the effective rate actually collected. Both runs solve, and the results page reports the reform against the baseline in steady state:

| Steady state | Reform against baseline |
|---|---|
| GDP | -1.05% |
| Consumption | -1.46% |
| Investment | -2.09% |
| Labour | +0.38% |
| Tax revenue | +5.36% |
| Business tax revenue | +48.7% |
| Real interest rate | -0.05 percentage points |

So the reform collects meaningfully more revenue and shrinks the capital stock doing it, and the consumption Gini barely moves. That trade-off, in those units, is the output the whole interface exists to produce.

### Adding an OG-Core mode to the MUIOGO interface ([#492](https://github.com/EAPD-DRB/MUIOGO/pull/492))

MUIOGO could only show CLEWS, so before an OG-Core page could exist the app needed to hold two models at once.

- A two-button model selector in the header. Switching swaps the sidebar and the working area together.
- CLEWS mode is the existing interface, untouched and still on its own green accent.
- OG mode uses orange and opens a grid of country calibration cards, read live from the installer register.
- New styling is isolated in a new `muiogo.css`, and OG markup sits under a `.ogc-page` root, so MUIOGO still merges cleanly with MUIO.
- Country flags are vendored SVGs rather than CDN requests, since this tool gets used where the internet isn't a given.

### Installing an OG-Core country calibration from the interface ([#495](https://github.com/EAPD-DRB/MUIOGO/pull/495))

Each calibration is a separate package with its own environment, so setting one up previously meant cloning a repository and building a virtualenv by hand.

- Install a calibration from the catalogue, with the install log streaming while it runs.
- Add a calibration that isn't in the catalogue, from either a local folder or a Git URL.
- A background update check, so an "update available" badge appears where upstream has moved ahead.
- Remove a calibration, which de-registers it inside MUIOGO and leaves the files on disk.
- Verified against the real backend rather than mocks. Ethiopia and South Africa from the catalogue, OG-USA from a Git URL, each producing an environment whose own Python imports the package.

### Creating baselines and reforms, and running the model ([#522](https://github.com/EAPD-DRB/MUIOGO/pull/522))

This is the modelling workflow and the core of the project.

- Create, edit, duplicate and delete baselines and reforms.
- A parameter editor built on Tabulator. Each parameter shows its OG-Core name, its allowed range and the year it applies from, layered over the calibration's own defaults.
- A run queue with live worker logs, cancellation and run history.
- Progress reports the stage and the iteration count rather than a percentage, because OG-Core doesn't expose one.
- A reform whose baseline has no results can't be run, and the row says why instead of failing part way through.

The live log is the model's own output, streamed through to the browser:

```python
making dir:  C:\Users\Aviral\.muiogo\og-state\cases\Baseline 1\res\New reform\SS
making dir:  C:\Users\Aviral\.muiogo\og-state\cases\Baseline 1\res\New reform\TPI
In runner, baseline is  False
Using previous solutions for SS
GE loop errors = ['-1.395e-03', '-1.126e-03', '-1.640e-02', '0.000e+00',
                  '-1.531e-02', '-1.822e-05', '-2.449e-05', '-2.596e-05']
```

Those `GE loop errors` are the general equilibrium residuals shrinking towards the solver's tolerance, which is the honest version of a progress bar.

### Comparing a baseline against a reform ([#525](https://github.com/EAPD-DRB/MUIOGO/pull/525))

A finished run leaves a folder of result files on disk, one directory per run.

```text
cases/<country_id>/<casename>/
  genData.json
  res/<run_name>/
    run_meta.json        MUIOGO writes this
    ogcParams.json
    run_status.json      the worker writes this
    run_log.txt
```

- Select a baseline run and a reform run, and the page computes the percentage change between them for GDP, consumption, labour, investment and the tax aggregates, plus inequality measures.
- Charts on Apache ECharts, written as a model-neutral renderer instead of an OG-only one.
- Analysis tables with SVG and CSV export.
- ECharts replaced two commercial charting libraries the old viewer depended on, which I'd raised as an issue early in the summer.

<p align="center">
  <img src="/images/gsoc/muiogo-screens.jpg" alt="Four screens of the OG-Core interface: cases, parameters, run and results" width="100%">
</p>

Issues I raised along the way: [#490](https://github.com/EAPD-DRB/MUIOGO/issues/490), [#491](https://github.com/EAPD-DRB/MUIOGO/issues/491), [#494](https://github.com/EAPD-DRB/MUIOGO/issues/494), [#500](https://github.com/EAPD-DRB/MUIOGO/issues/500), [#501](https://github.com/EAPD-DRB/MUIOGO/issues/501), [#521](https://github.com/EAPD-DRB/MUIOGO/issues/521), [#524](https://github.com/EAPD-DRB/MUIOGO/issues/524) and [#528](https://github.com/EAPD-DRB/MUIOGO/issues/528).

## How it fits together

<img src="/images/gsoc/muiogo-architecture.svg" alt="MUIOGO architecture: browser shell with CLEWS and OG-Core pages, an Ogc API wrapper, Flask, OG-Core services, and the worker process running in the country calibration venv" width="100%">

Every OG-Core page reaches the backend through one wrapper under the `/ogc` prefix, and every route answers in the same shape, so the frontend has exactly one success check to write:

```json
{ "message": "Case Baseline 1 created.", "status_code": "created" }
```

A solve doesn't run inside Flask. Each installed country gets its own virtual environment, and the worker process starts with that interpreter, so the model code never gets imported into the web app. That matters because two calibrations can pin different OG-Core versions. File ownership is split the same way. MUIOGO owns the run metadata and the log, the worker owns the status file and the results, and a run only counts as finished when the worker exits cleanly.

## The workflow

<img src="/images/gsoc/muiogo-journey.svg" alt="Workflow from Home to Cases to Parameters to Run to Results, with a lane for guards and failure states" width="100%">

Every completed run stores a fingerprint of its inputs, so changing a parameter invalidates that run's results, and rerunning a baseline invalidates every reform sitting on top of it. The bottom lane of the diagram is where that gets enforced. Working out that these were real constraints and not details I could skip took me a while.

## What's left to do

The full project is four deliverables. A cross-platform baseline, OG-Core on its own, coupled one-way runs where one model's output feeds the other, and a converging workflow that iterates both until the answers stop moving. My summer was the second one.

Coupled mode is the next piece of UI work. You run CLEWS, turn what the energy and land and water system did into the fiscal inputs OG-Core understands, and run OG-Core on top. Then the other direction. The hard part isn't the running, it's the translation, because the two models have different output shapes, different units and different time resolution. So the set of bridge variables has to be agreed first. After that it needs a guided run rather than one button, with the exchanged values shown at each handoff so an analyst can check them, and a combined view of the physical and fiscal side of the same scenario.

Then converging, which is the same thing in a loop until the numbers settle. The design problem there is showing distance to tolerance per iteration, so you can see whether it's converging or stuck and stop it early. Packaging the app into a downloadable installer per platform is also still ahead.

## Thanks

<p align="center">
  <img src="/images/gsoc/meeting.jpg" alt="A MUIOGO team video call" width="88%">
</p>

*One of our weekly calls.*

Thanks to Alfonso and Marcelo for reviewing carefully, and to Aditya for the backend I spent four months calling. My favourite part was that this wasn't a demo. The models get used by economists in developing countries to test real fiscal and climate policy, and the work carries on past GSoC through UN DESA's country programmes.
