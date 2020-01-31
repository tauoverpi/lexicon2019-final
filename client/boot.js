// INTERFACE client
//     interface clients must uphold to be runnable
//   step: () -> void
//     advance the client state by one frame
//   init: store -> void
//     setup handlers, initial dom tree, open websocket connections, etc

window.onload = () => {
  //   const ws = new WebSocket("wss://echo.websocket.org/");
  //   ws.onopen = e => {
  //     console.log("open");
  //     ws.send("hi");
  //   };
  //   ws.onclose = e => console.log("close");
  //   ws.onmessage = e => console.log("msg", e);
  //   ws.onerror = e => console.log("err");

  // local storage
  const store = window.localStorage;

  let client = undefined;
  let version = store.getItem("client version");
  // TODO: get server version
  // TODO: compare versions
  // TODO: load server version and cache if newer
  client = store.getItem("client");

  client.init(store);

  // game loop
  const loop = () => {
    client.step();
    window.requestAnimationFrame(loop);
  };
};

// vim: et sw=2 ts=2
