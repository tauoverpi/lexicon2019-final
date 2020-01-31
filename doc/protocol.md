Client - Server communication protocol
========================================

Game updates
-------------

The client-server protocol consists of messages describing the current game
state through partial and full updates to the game state.

```
digraph server_player {
}
```

### Session Update Message

- `ptime` - keeps track of _pseudo time_ to ensure they're
  processed in order. `ptime` is updated upon each update from the server and
  expects the clients to respond with the current `ptime`. If clients do not
  respond with the correct `ptime` they're sent the entire client state tracked
  by the server in order to rebuild it client-side.
 `type` - type of the payload in the message used to decide what to cast it to
  server side and how to interpret it javascript side.
- `payload` - message payload
- `destination` - target address to send the message to, consists of a 32 bit
  integer.

#### Type Field

Alive requests
--------------

The server requires the client responds to ping messages to tell if it's still
alive.

### Ping Message

- `name` - name of the server as a string
- `pong` - boolean constant false

### Pong Message

- `name` - name of the server
- `pong` - boolean constant true

