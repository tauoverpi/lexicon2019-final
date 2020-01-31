/*const AWebsocket = (runtime, address) => {
  let connection = new Websocket(address);
  let spid = undefined;
  const behaviour = (rt, self, mail) => {
    switch (mail.mtype) {
      case Protocol.KernelTerminate.id:
        connection.close();
        runtime.die();
        break;
      case Protocol.KernelKilled.id:
        connection.close();
        runtime.die();
        break;
      case Protocol.WebsocketOpen.id:
        break;
      case Protocol.WebsocketClose.id:
        break;
      case Protocol.WebsocketError.id:
        connection.close();
        runtime.die();
        break;
      case Protocol.WebsocketMessage:
        break;
      case Protocol.WebsocketSend:
        connection.send(mail.content);
        break;
      default:
        break;
    }
  };
  return {
    spawn: () => {
      spid = runtime.spawn(behaviour);
    },
    spawn_link: () => {
      spid = runtime.spawn_link(runtime.pid, behaviour);
    },
    send: mail => {
      runtime.send(spid, { type: Protocol.WebSocketSend.id, content: mail });
    }
  };
};*/

// vim: et sw=2 ts=2
