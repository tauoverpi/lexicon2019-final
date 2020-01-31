// Kernel

const newMail = (type, content) => {
  console.log("new mail", type);
  return { type: type.id, content: content };
};

// Default actor error handling
const Actor = behaviour => {
  const wrapper = (rt, self, mail) => {
    switch (mail.type) {
      case Protocol.KernelKilled.id:
      case Protocol.KernelTerminate.id:
        try {
          rt.call(self, mail);
        } catch {}
        rt.Die();
        break;
      case Protocol.Info.id:
        // TODO
        break;
      default:
        behaviour(rt, self, mail);
    }
  };
  return wrapper;
};

const Supervisor = (strategy, behaviour) => {
  const wrapper = (rt, self, mail) => {
    switch (mail.type) {
      case Protocol.KernelKilled.id:
        strategy(rt, self, mail.content.pid);
        break;
      case Protocol.Info.id:
        // TODO
        break;
      default:
        behaviour(rt, self, main);
        break;
    }
  };
  return wrapper;
};

const Kernel = (debugLevel = 0, loopLimit = 0x3ff) => {
  console.log("initializing kernel");
  let store = {};
  let queue = [];
  let pidc = 0;
  let pidv = false;
  let debugstep = 0;

  // generate a new unique PID when size(store) < 2^32
  //
  //   newpid: unit -> pid
  //
  const newpid = () => {
    let pid = pidc;
    while (pidv && pid in store) pidc = (pidc + 1) & 0xffffffff;
    pidc = (pidc + 1) & 0xffffffff;
    if (pidc == 0) pidv = true;
    return pid;
  };

  const self = {
    // Spawn a new actor
    //
    //   spawn: behaviour -> pid
    //
    spawn: behaviour => {
      console.log(self);
      const pid = newpid();
      const runtime = {
        spawn: meth => self.spawn(meth),
        spawnLink: meth => self.spawnLink(parent, meth),
        send: (to, type, msg) => self.send(to, newMail(type, msg)),
        call: (to, type, msg) => self.call(to, newMail(type, msg)),
        self: pid,
        tokens: loopLimit,
        loop: msg => self.loop(pid, newMail(Protocol.LoopIteration, msg)),
        die: undefined // TODO
      };

      store[pid] = {
        runtime: runtime,
        behaviour: behaviour,
        mailbox: [],
        children: []
      };

      console.log("spawned actor at address", pid);
      return pid;
    },

    // Spawn a new actor with a link to it's parent.
    //
    //   spawnLink: (pid, behaviour) -> pid
    //
    spawnLink: (parent, behaviour) => {
      const pid = newpid();
      const runtime = {
        spawn: meth => self.spawn(meth),
        spawnLink: meth => self.spawnLink(parent, meth),
        send: (to, msg) => self.send(to, newMail(type, msg)),
        call: (to, msg) => self.call(to, newMail(type, msg)),
        tokens: loopLimit,
        loop: msg => self.loop(pid, newMail(Protocol.LoopIteration, msg)),
        self: pid,
        die: undefined // TODO
      };

      store[pid] = {
        runtime: runtime,
        behaviour: behaviour,
        mailbox: [],
        parent: parent,
        children: []
      };

      console.log(
        "spawned linked actor at address",
        pid,
        "with parent",
        parent
      );
      return pid;
    },

    // Send a message to another actor's mailbox while also scheduling that
    // actor to later process the given message.
    //
    //   send: (pid, mail) -> void
    //
    send: (to, mail) => {
      // we ignore failed sends to avoid a possible deadlock in sending
      // DoesNotExist messages.
      if (to in store) {
        console.log(
          "sending message to",
          to,
          "of type",
          mail.type,
          "message",
          mail
        );
        queue.push(to);
        store[to].mailbox.unshift(mail);
      }
    },

    // Call upon an actor as if it were a regular function which skips the
    // mailbox queue and directly returns a result. Should the actor not exist,
    // an exception is thrown.
    //
    //   call: (pid, mail) -> any
    //
    call: (to, mail) => {
      if (to in store) {
        const actor = store[to];
        return actor.behaviour(actor.runtime, to, mail);
      } else throw "actor does not exist";
    },

    // Loops represented as contituations allowing the kernel control over
    // iteration and thus avoid an actor from taking too long in loops.
    //
    //   loop: mail -> void
    loop: (pid, mail) => {
      const actor = store[pid];
      const tokens = actor.tokens;
      console.log("loop iteration", 0x3ff - tokens, "of", mail);
      if (tokens > 0) {
        actor.tokens = tokens - 1;
        actor.behaviour(actor.runtime, pid, mail);
      } else {
        actor.tokens = 0x3ff;
        self.send(pid, newMail(Protocol.LoopIteration, mail.content));
      }
    },

    // Advance the world state by one step by picking the next actor to run from
    // the pid queue and apply it's behaviour to the first message in it's
    // mailbox.
    //
    //   step: unit -> bool
    step: () => {
      console.log(
        "evaluating step",
        debugstep,
        "with a queue size of",
        queue.length
      );
      debugstep += 1;
      if (queue.length > 0) {
        const pid = queue.pop();
        console.log("running behaviour", pid);
        if (pid in store) {
          const actor = store[pid];
          const mail = actor.mailbox.pop();
          try {
            actor.behaviour(actor.runtime, pid, mail);
          } catch (e) {
            console.log("behavour", pid, "threw an exception", e);
            self.call(pid, {
              type: Protocol.KernelTerminate.id,
              content: "exception"
            });
          }
        }
        return true;
      } else {
        console.log("queue is empty, runtime has stopped");
        return false;
      }
    },
    //    kill: pid -> void
    kill: undefined // TODO
  };
  return self;
};

// vim: et sw=2 ts=2
