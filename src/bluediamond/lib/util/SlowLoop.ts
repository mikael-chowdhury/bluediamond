if (!Array.prototype.slowmap) {
  Array.prototype.slowmap = async function (
    func: (obj: any, index: number, arr: Array<any>) => any
  ) {
    const modified = [...this];

    let index = 0;
    const loop = () => {
      return new Promise(async (res, rej) => {
        const obj = modified[index];

        const promise = new Promise((resolve) => {
          setImmediate(async () => {
            modified[index] = await func(obj, index, modified);
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

    return modified;
  };
}
