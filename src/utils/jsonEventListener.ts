class JsonEventListener {
  addSub(name: string, cb: (payload: any) => void) {
    return this;
  }

  exec(events: string[], payload: any) {
    this
  }
}

const x = new JsonEventListener()
  .addSub("addressChange", (payload) => {
    //add to queue
  })
  .addSub("addressChange", (payload) => {
    //add to mongo
  });

x.exec([""]);
