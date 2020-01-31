// Maybe monad
const Some = x => ({
  map: fn => Some(fn(x)),
  bind: m => m(x),
  match: (none, some) => some(x)
});

const None = {
  map: fn => None,
  bind: m => None,
  match: (none, some) => none
};

const maybeExcept = (e, ...xs) => {
  try {
    return Some(e(...xs));
  } catch {
    return None;
  }
};

// Either monad
const Left = x => ({
  map: fn => Left(x),
  bind: m => Left(x),
  bimap: left => right => Left(left(x)),
  match: left => right => left(x)
});

const Right = x => ({
  map: fn => Right(fn(x)),
  bind: m => m(x),
  bimap: left => right => Right(right(x)),
  match: left => right => right(x)
});

// vim: et sw=2 ts=2
