# Subliminal Spaces Phase I Analysis Pipeline

## Overview

This repository contains a Node.js data-processing pipeline for the **Subliminal Spaces** NYC subway research project.

It transforms a Qualtrics Phase I export into a research-ready JSON artifact that:

- groups responses by station and stimulus
- preserves exposure-level records for later modeling
- computes descriptive statistics for comfort and safety
- derives normalized emotion and topic labels from short free-text affect responses
- computes a bounded **satisfaction score**
- computes a spec-aligned **Subliminal Index Score (SIS)** using a Phase I stress proxy
- preserves demographic summaries for subgroup auditing and future expansion

The implementation is intentionally structured so that **Phase II physiological data** can be added later without redesigning the output schema.

## Research Context

The project studies how subway environments produce emotional and perceptual responses that may not be fully conscious. In Phase I, participants see randomized visual or audio stimuli and report:

- a short affective response in five words or fewer
- a comfort rating on a 1-7 Likert scale
- a safety rating on a 1-7 Likert scale
- optional demographic information collected at the end of the survey

The goal of this pipeline is to convert those responses into structured signals that can support:

- descriptive analysis
- dashboarding
- station comparison
- future predictive modeling
- later fusion with physiological measures in Phase II

## Source Documents Incorporated

The most important specification points folded into this code are:

- station-level aggregation is required
- comfort and safety are modeled as 1-7 Likert variables
- short-text affect should become structured labels
- demographics should be preserved for future analysis, but used cautiously
- the station-level scoring target is the **Subliminal Index Score**

## Spec-Derived Equations

### Station Aggregation

From the technical specification, station-level comfort and safety are defined as averages across responses associated with station \(s\):

$$
\mathrm{Comfort}_s = \frac{1}{n_s}\sum_{i=1}^{n_s} C_i
$$

$$
\mathrm{Safety}_s = \frac{1}{n_s}\sum_{i=1}^{n_s} S_i
$$

where:

- \(n_s\) is the number of responses associated with station \(s\)
- \(C_i\) is the comfort score for response \(i\)
- \(S_i\) is the safety score for response \(i\)

### Phase II Physiological Stress Proxy From Spec

The technical specification defines Phase II stress using physiology:

$$
\Delta \mathrm{HRV}_i = \mathrm{HRV}_{baseline,i} - \mathrm{HRV}_{exposure,i}
$$

$$
\Delta \mathrm{BP}_i = \mathrm{BP}_{post,i} - \mathrm{BP}_{pre,i}
