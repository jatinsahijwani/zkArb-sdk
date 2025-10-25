pragma circom 2.1.4;

template Simple() {
    signal input a;
    signal input b;
    signal output c;

    c <== a + b;
}

component main = Simple();