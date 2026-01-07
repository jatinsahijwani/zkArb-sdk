pragma circom 2.1.4;

include "comparators.circom";

template CountryCheck() {
    signal input country;
    signal output isAllowed;

    // allowed country codes
    signal allowed0;
    signal allowed1;
    signal allowed2;

    allowed0 <== 356; // India
    allowed1 <== 840; // USA
    allowed2 <== 124; // Canada

    // country == allowed0
    component lt0a = LessThan(16);
    component lt0b = LessThan(16);
    lt0a.in[0] <== country;
    lt0a.in[1] <== allowed0;
    lt0b.in[0] <== allowed0;
    lt0b.in[1] <== country;
    signal eq0;
    eq0 <== 1 - (lt0a.out + lt0b.out);

    // country == allowed1
    component lt1a = LessThan(16);
    component lt1b = LessThan(16);
    lt1a.in[0] <== country;
    lt1a.in[1] <== allowed1;
    lt1b.in[0] <== allowed1;
    lt1b.in[1] <== country;
    signal eq1;
    eq1 <== 1 - (lt1a.out + lt1b.out);

    // country == allowed2
    component lt2a = LessThan(16);
    component lt2b = LessThan(16);
    lt2a.in[0] <== country;
    lt2a.in[1] <== allowed2;
    lt2b.in[0] <== allowed2;
    lt2b.in[1] <== country;
    signal eq2;
    eq2 <== 1 - (lt2a.out + lt2b.out);

    // OR logic
    isAllowed <== eq0 + eq1 + eq2;
}

component main = CountryCheck();
