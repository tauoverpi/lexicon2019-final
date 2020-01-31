Non-Player Characters
=====================

Regular
-------

Mind
----

### Inputs

- enemy gladiator type
- coin
- win
- loss

### Outputs

- purchase gladiator
- purchase gear
- request play
- pick gladiator

### Training

```
pub fn crossover(dst: []u16, srcA: []u16, srcB: []u16) void {
    assert(srcA.len == srcB.len);
    assert(dst.len == srcB.len);
    while (i < srcA.len) : (i += 1) {
        if (i&1 == 0) {
            dst[i] = srcA[i];
        } else {
            dst[i] = srcB[i];
        }
    }
}
```
