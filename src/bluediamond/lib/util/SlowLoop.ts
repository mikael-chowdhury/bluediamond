if (!Array.prototype.slowmap) {
  Array.prototype.slowmap = async function (
    func: (obj: any, index: number, arr: Array<any>) => any
  ) {
    let index = 0;
    const loop = () => {
      return new Promise(async (res, rej) => {
        const obj = this[index];

        const promise = new Promise((resolve) => {
          setImmediate(async () => {
            this[index] = await func(obj, index, this);
            resolve(null);
          });
        });

        await promise;

        if (index + 1 == this.length) res(null);

        index++;

        res(loop());
      });
    };

    await loop();

    return this;
  };
}
