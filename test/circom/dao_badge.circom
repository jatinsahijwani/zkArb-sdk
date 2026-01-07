pragma circom 2.1.4;

include "comparators.circom";

template DAOBadge() {
    // private input: user's badge ID
    signal input badge;

    // public output
    signal output hasBadge;

    // DAO-issued badge ID (example)
    signal daoBadge;
    daoBadge <== 42;

    // badge == daoBadge
    component ltA = LessThan(8);
    component ltB = LessThan(8);

    ltA.in[0] <== badge;
    ltA.in[1] <== daoBadge;

    ltB.in[0] <== daoBadge;
    ltB.in[1] <== badge;

    // equality check
    hasBadge <== 1 - (ltA.out + ltB.out);
}

component main = DAOBadge();
