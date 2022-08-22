const bd = require("@rexysaur/bluediamond")

new bd.Project().run(async () => {
    const datagram = new bd.DataGram()

    const table = new bd.Table()
    await table.fromSAS("./data.sas7bdat")
    table.appendToDataGramMatrix(datagram)

    const res = await datagram.build()
    return res
})
