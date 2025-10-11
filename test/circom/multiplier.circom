pragma circom 2.1.4;

template Multiplier() {
    signal input x;
    signal input y;
    signal output product;

    product <== x * y;
}

component main = Multiplier();
