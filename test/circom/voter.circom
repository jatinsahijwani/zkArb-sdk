pragma circom 2.1.4;

// Simple boolean constraint: vote must be 0 or 1
template Voter() {
    signal input vote;
    signal output valid;

    // Enforce that vote is either 0 or 1
    vote * (vote - 1) === 0;

    valid <== vote;
}

component main = Voter();
