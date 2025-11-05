pragma circom 2.1.4;

include "comparators.circom";

template AgeCheck() {
    // Input: user's age
    signal input age;

    // Output: 1 if age >= 18, else 0
    signal output isAdult;

    // Comparator: LessThan(nBits)
    component lt = LessThan(8); // since age is a small number (<256)

    lt.in[0] <== age;       // user’s age
    lt.in[1] <== 18;        // comparison constant

    // LessThan outputs 1 if in[0] < in[1]
    // So we reverse it: isAdult = 1 - lt.out  (=> 1 if age >= 18)
    isAdult <== 1 - lt.out;
}

component main = AgeCheck();
