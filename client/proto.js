// FORMAT message type
//     Message types both internal and those shared by te client and server. The ID
//     is local and there's no guarantee the server or even other clients will have
//     the same interger value thus we must fallback the string form when talking to
//     other clients.
//   id: int
//     integer id of the message used internally for faster lookup
//   internal: bool
//
const Protocol = {
  KernelTerminate: { id: 0, internal: true },
  KernelKilled: { id: 1, internal: true },
  WebsocketOpen: { id: 2, internal: true },
  WebsocketClose: { id: 3, internal: true },
  WebsocketError: { id: 4, internal: true },
  WebsocketMessage: { id: 5, internal: true },
  BroadcastMessage: { id: 6, internal: false },
  BroadcastSubscribe: { id: 7, internal: false },
  LoopIteration: { id: 8, internal: true },
  Generic: { id: 9, internal: true },
  Info: { id: 10, internal: true }
};

// Protocol "reflection" of the internal protocol
const ProtocolReflection = (() => {
  let self = {};
  for (let key in Protocol.keys) {
    self[key] = Protocol[key].id;
  }
  return self;
})();

// FORMAT network messages
//     type of the message content
//   type: type
//     content of unknown complexity
//   content: dynamic
//     address of the recipient
//   address: pid

// vim: et sw=2 ts=2
