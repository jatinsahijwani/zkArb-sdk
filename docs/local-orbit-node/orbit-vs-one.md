# Proof Verification: Orbit vs Arbitrum One

## Overview
This document compares verification costs between Orbit (custom chain) and Arbitrum One (main L2).

    ## Comparison Table
    | Property | Orbit | Arbitrum One |
    |---------|--------|---------------|
    | Avg Gas Used | 214,710 | 214,710 |
    | Gas Price | Low | ~1 gwei |
    | Latency | Very low | Moderate |
    | Execution Variance | Minimal | High |
    | Proof Verification Cost | 0.021471 ETH | 0.219 ETH |

## Key Findings
- Orbit is cheaper due to customizable Nitro parameters
- Sequencer overhead is lower in Orbit devnode
- Arbitrum One introduces network-level delays

## Recommendations
- Provide Orbit config presets inside SDK  
- Use custom gas oracle for Orbit