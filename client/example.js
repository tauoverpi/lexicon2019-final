// Examples of actors

// Logging actor which just logs anything it's sent to the console
const logger = (runtime, self, mail) => {
  console.log(self, "::", mail);
};

// A stateless factorial actor
const AFactorial = runtime => {
  let spid = undefined;
  const behaviour = (rt, self, mail) => {
    console.log(self, "::", mail);
    switch (mail.type) {
      case Protocol.Generic.id:
        rt.loop({ n: 1, c: mail.content.c, from: mail.content.from });
        break;
      case Protocol.LoopIteration.id:
        if (mail.content.c > 0) {
          rt.loop({
            n: mail.content.n * mail.content.c,
            c: mail.content.c - 1,
            from: mail.content.from
          });
        } else {
          rt.send(mail.content.from, Protocol.Generic, mail.content.n);
        }
        break;
      default:
        // ignore messages we can't handle, we should fail here but in the
        // example it's ok
        break;
    }
  };
  return {
    start: () => {
      spid = runtime.spawn(behaviour);
      return spid;
    },
    startLink: () => {
      spid = runtime.spawnLink(behaviour);
      return spid;
    },
    compute: (recipient, number) => {
      console.log(spid);
      runtime.send(
        spid,
        newMail(Protocol.Generic, { n: 1, c: number, from: recipient })
      );
    }
  };
};
