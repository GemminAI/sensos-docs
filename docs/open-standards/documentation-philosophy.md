---
title: Documentation Philosophy
description: WHAT vs HOW TO INTEGRATE vs HOW IT WORKS vs WHY WE WIN across the SensOS documentation hierarchy.
order: 6
---


**Version:** 1.0.0  
**Status:** Adopted

## 1. Core model

SensOS documentation is stratified by question, not by file format.

| Tier | Question answered | Reader outcome |
| --- | --- | --- |
| **Public** | **WHAT** | Understand guarantees and build against interfaces |
| **Partner** | **HOW TO INTEGRATE** | Connect systems under agreement without guessing encodings |
| **Internal** | **HOW IT WORKS** | Engineer and operate Gemmina implementations |
| **Trade Secret** | **WHY WE WIN** | Protect differentiated methods and know-how |
| **Enterprise** | **HOW TO ADOPT SAFELY** | Diligence, deployment, and shared responsibility |

## 2. Public documentation answers WHAT

Public pages and Public Standard RFCs explain:

- what SensOS is for,
- what behavior integrators may rely on,
- what interfaces exist,
- what conformance means,
- what compatibility promises are in force.

Public documentation MUST NOT explain proprietary methods. If a sentence teaches a competitor to reproduce advantage faster than it helps a customer integrate safely, it is not public.

## 3. Partner documentation answers HOW TO INTEGRATE

Partner specifications provide the additional detail required to implement on-the-wire or credential formats that are intentionally withheld from the public corpus.

They assume NDA (or equivalent) and always reference a Public Standard as the behavioral parent.

## 4. Internal documentation answers HOW IT WORKS

Internal engineering documents describe module structure, design rationale, maturity, experiments, and operational mechanics of Gemmina systems.

They are not a substitute for Public Standards and MUST NOT be linked as customer-facing normative contracts.

## 5. Trade Secret documentation answers WHY WE WIN

Trade secrets record the methods, calibrations, and strategies that create durable product advantage.

They are need-to-know, access-controlled, and never published on sensos.org.

## 6. Enterprise documentation answers HOW TO ADOPT SAFELY

Enterprise materials help buyers and operators evaluate risk, responsibility, and production readiness. They may be deeper than Public docs while still respecting Trade Secret boundaries.

## 7. Consistency rules

1. Homepage and product pages speak customer value (WHAT / WHY BUY).
2. Open Standards pages speak ecosystem contracts (WHAT / HOW TO COMPLY).
3. Developer pages speak integration against public contracts (WHAT + public HOW).
4. Partner portals speak integration annexes (HOW TO INTEGRATE).
5. Internal and Trade Secret stores never appear in primary public navigation.

## 8. Relationship to RFC Philosophy

The earlier “WHAT, not HOW” RFC rule remains in force for Public Standards. This document generalizes that rule across the full documentation hierarchy.

See also:

- [Open Standards Charter](/Open-Standards/Charter)
- [RFC Classification Policy](/Open-Standards/Classification)
