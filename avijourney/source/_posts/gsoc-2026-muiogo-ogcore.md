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

Google Summer of Code 2026 is done. I spent the summer with the [United Nations Office of Information and Communications Technology](https://unite.un.org/), on a project owned by the Economic Analysis and Policy Division at [UN DESA](https://www.un.org/en/desa), and my work was the <span class="t-model">OG-Core</span> side of a tool called <a class="t-app" href="https://github.com/EAPD-DRB/MUIOGO">MUIOGO</a>.

<span class="t-app">MUIOGO</span> is a browser interface for two open source policy models. <a class="t-model" href="https://github.com/OSeMOSYS/OSeMOSYS">CLEWS</a> covers climate, land, energy and water, so it tells a country whether a plan is physically possible, like whether there's enough land and water for a biofuel policy. <a class="t-model" href="https://github.com/PSLmodels/OG-Core">OG-Core</a> is an overlapping generations general equilibrium model, so it shows what a tax or pension change does to growth and jobs across generations. Both have been used in more than 20 countries.

<!-- more -->

Three things feed into <span class="t-app">MUIOGO</span>, which is worth getting straight before anything else.

<img src="/images/gsoc/muiogo-upstream.svg" alt="OG-Core is calibrated per country into OG-ETH, OG-ZAF and OG-USA, which MUIOGO installs at runtime. MUIOGO is forked from OSeMOSYS and MUIO" width="100%">

<span class="t-model">OG-Core</span> itself is generic. A country becomes usable by calibrating it, which produces a separate Python package like [`OG-ETH`](https://github.com/EAPD-DRB/OG-ETH) for Ethiopia or [`OG-ZAF`](https://github.com/EAPD-DRB/OG-ZAF) for South Africa, each pinned to its own <span class="t-model">OG-Core</span> version. <span class="t-app">MUIOGO</span> is downstream of <a class="t-app" href="https://github.com/OSeMOSYS/MUIO">MUIO</a>, the existing <span class="t-model">OSeMOSYS</span> interface, so anything I write has to keep future upstream syncs mergeable. <span class="t-model">CLEWS</span> already had a UI through that lineage. <span class="t-model">OG-Core</span> had none, and that was my project.

<p class="term-key">Colour key for the rest of this post. <span class="t-model">the models</span>, <span class="t-app">the software around them</span>, <span class="t-base">a baseline run</span>, <span class="t-reform">a reform measured against one</span>.</p>

## What I worked on

| PR | What it does |
|---|---|
| [#492](https://github.com/EAPD-DRB/MUIOGO/pull/492) | The <span class="t-app">MUIOGO</span> shell. Model selector, per-model menus, the OG calibration home |
| [#495](https://github.com/EAPD-DRB/MUIOGO/pull/495) | Install, update, add and remove a country calibration, with a live install log |
| [#522](https://github.com/EAPD-DRB/MUIOGO/pull/522) | Cases, parameters and run management |
| [#525](https://github.com/EAPD-DRB/MUIOGO/pull/525) | The results workspace |

Taking one policy question end to end shows what those four add up to. Say the question is what raising Ethiopia's effective corporate tax rate does to the economy. I install the `OG-ETH` calibration, which arrives with the country's own estimated defaults. I create a <span class="t-base">baseline</span>, which is a run of the economy as calibrated, with nothing changed. Then a <span class="t-reform">reform</span> on top of it, changing one parameter, `adjustment_factor_for_cit_receipts`, the factor that lifts the statutory corporate rate to the effective rate actually collected. Both runs solve, and the results page reports the <span class="t-reform">reform</span> against the <span class="t-base">baseline</span> in steady state:

| Steady state | Reform against baseline |
|---|---|
| GDP | <span class="t-down">-1.05%</span> |
| Consumption | <span class="t-down">-1.46%</span> |
| Investment | <span class="t-down">-2.09%</span> |
| Labour | <span class="t-up">+0.38%</span> |
| Tax revenue | <span class="t-up">+5.36%</span> |
| Business tax revenue | <span class="t-up">+48.7%</span> |
| Real interest rate | <span class="t-down">-0.05 percentage points</span> |

So the <span class="t-reform">reform</span> collects meaningfully more revenue and shrinks the capital stock doing it, and the consumption Gini barely moves. That trade-off, in those units, is the output the whole interface exists to produce.

### [Adding an OG-Core mode to the MUIOGO interface (#492)](https://github.com/EAPD-DRB/MUIOGO/pull/492)

<span class="t-app">MUIOGO</span> could only show <span class="t-model">CLEWS</span>, so before an <span class="t-model">OG-Core</span> page could exist the app needed to hold two models at once.

- A two-button model selector in the header. Switching swaps the sidebar and the working area together.
- <span class="t-model">CLEWS</span> mode is the existing interface, untouched and still on its own green accent.
- OG mode uses orange and opens a grid of country calibration cards, read live from the installer register.
- New styling is isolated in a new `muiogo.css`, and OG markup sits under a `.ogc-page` root, so <span class="t-app">MUIOGO</span> still merges cleanly with <span class="t-app">MUIO</span>.
- Country flags are vendored SVGs rather than CDN requests, since this tool gets used where the internet isn't a given.

### [Installing an OG-Core country calibration from the interface (#495)](https://github.com/EAPD-DRB/MUIOGO/pull/495)

Each calibration is a separate package with its own environment, so setting one up previously meant cloning a repository and building a virtualenv by hand.

- Install a calibration from the catalogue, with the install log streaming while it runs.
- Add a calibration that isn't in the catalogue, from either a local folder or a Git URL.
- A background update check, so an "update available" badge appears where upstream has moved ahead.
- Remove a calibration, which de-registers it inside <span class="t-app">MUIOGO</span> and leaves the files on disk.
- Verified against the real backend rather than mocks. Ethiopia and South Africa from the catalogue, [OG-USA](https://github.com/PSLmodels/OG-USA) from a Git URL, each producing an environment whose own Python imports the package.

### [Creating baselines and reforms, and running the model (#522)](https://github.com/EAPD-DRB/MUIOGO/pull/522)

This is the modelling workflow and the core of the project.

- Create, edit, duplicate and delete <span class="t-base">baselines</span> and <span class="t-reform">reforms</span>.
- A parameter editor built on [Tabulator](https://tabulator.info/). Each parameter shows its <span class="t-model">OG-Core</span> name, its allowed range and the year it applies from, layered over the calibration's own defaults.
- A run queue with live worker logs, cancellation and run history.
- Progress reports the stage and the iteration count rather than a percentage, because <span class="t-model">OG-Core</span> doesn't expose one.
- A <span class="t-reform">reform</span> whose <span class="t-base">baseline</span> has no results can't be run, and the row says why instead of failing part way through.

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

### [Comparing a baseline against a reform (#525)](https://github.com/EAPD-DRB/MUIOGO/pull/525)

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

- Select a <span class="t-base">baseline</span> run and a <span class="t-reform">reform</span> run, and the page computes the percentage change between them for GDP, consumption, labour, investment and the tax aggregates, plus inequality measures.
- Charts on [Apache ECharts](https://echarts.apache.org/), written as a model-neutral renderer instead of an OG-only one.
- Analysis tables with SVG and CSV export.
- ECharts replaced two commercial charting libraries the old viewer depended on, which I'd raised as an issue early in the summer.

<p align="center">
  <img src="/images/gsoc/muiogo-screens.jpg" alt="Four screens of the OG-Core interface: cases, parameters, run and results" width="100%">
</p>

Issues I raised along the way: [#490](https://github.com/EAPD-DRB/MUIOGO/issues/490), [#491](https://github.com/EAPD-DRB/MUIOGO/issues/491), [#494](https://github.com/EAPD-DRB/MUIOGO/issues/494), [#500](https://github.com/EAPD-DRB/MUIOGO/issues/500), [#501](https://github.com/EAPD-DRB/MUIOGO/issues/501), [#521](https://github.com/EAPD-DRB/MUIOGO/issues/521), [#524](https://github.com/EAPD-DRB/MUIOGO/issues/524) and [#528](https://github.com/EAPD-DRB/MUIOGO/issues/528).

## How it fits together

<img src="/images/gsoc/muiogo-architecture.svg" alt="MUIOGO architecture: browser shell with CLEWS and OG-Core pages, an Ogc API wrapper, Flask, OG-Core services, and the worker process running in the country calibration venv" width="100%">

Every <span class="t-model">OG-Core</span> page reaches the backend through one wrapper under the `/ogc` prefix, and every route answers in the same shape, so the frontend has exactly one success check to write:

```json
{ "message": "Case Baseline 1 created.", "status_code": "created" }
```

A solve doesn't run inside Flask. Each installed country gets its own virtual environment, and the worker process starts with that interpreter, so the model code never gets imported into the web app. That matters because two calibrations can pin different <span class="t-model">OG-Core</span> versions. File ownership is split the same way. <span class="t-app">MUIOGO</span> owns the run metadata and the log, the worker owns the status file and the results, and a run only counts as finished when the worker exits cleanly.

## The workflow

<img src="/images/gsoc/muiogo-journey.svg" alt="Workflow from Home to Cases to Parameters to Run to Results, with a lane for guards and failure states" width="100%">

Every completed run stores a fingerprint of its inputs, so changing a parameter invalidates that run's results, and rerunning a <span class="t-base">baseline</span> invalidates every <span class="t-reform">reform</span> sitting on top of it. The bottom lane of the diagram is where that gets enforced. Working out that these were real constraints and not details I could skip took me a while.

## What's left to do

The full project is four deliverables. A cross-platform baseline, <span class="t-model">OG-Core</span> on its own, coupled one-way runs where one model's output feeds the other, and a converging workflow that iterates both until the answers stop moving. My summer was the second one.

Coupled mode is the next piece of UI work. It runs <span class="t-model">CLEWS</span>, turns what the energy and land and water system did into the fiscal inputs <span class="t-model">OG-Core</span> understands, and runs <span class="t-model">OG-Core</span> on top. Then the other direction. The hard part isn't the running, it's the translation, because the two models have different output shapes, different units and different time resolution. So the set of bridge variables has to be agreed first. After that it needs a guided run rather than one button, with the exchanged values shown at each handoff so an analyst can check them, and a combined view of the physical and fiscal side of the same scenario.

Then converging, which is the same thing in a loop until the numbers settle. The design problem there is showing distance to tolerance per iteration, so a stuck or oscillating run is obvious early enough to cancel it. Packaging the app into a downloadable installer per platform is also still ahead.

## Thanks

<p align="center">
  <img src="/images/gsoc/meeting.jpg" alt="A MUIOGO team video call" width="88%">
</p>

*One of our weekly calls.*

Thanks to Alfonso and Marcelo for reviewing carefully, and to Aditya for the backend I spent four months calling. My favourite part was that this wasn't a demo. The models get used by economists in developing countries to test real fiscal and climate policy, and the work carries on past GSoC through UN DESA's country programmes.
