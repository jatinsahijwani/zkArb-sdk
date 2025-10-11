pragma circom 2.1.4;

include "poseidon.circom";

template Hash() {
    signal input preimage[2];
    signal output hash;

    component poseidon = Poseidon(2);
    for (var i = 0; i < 2; i++) {
        poseidon.inputs[i] <== preimage[i];
    }

    hash <== poseidon.out;
}

component main = Hash();
