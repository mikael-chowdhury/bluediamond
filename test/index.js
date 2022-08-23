const { Project, DataGram, Field, DissapatedField } = require("@rexysaur/bluediamond")

new Project().run(async () => {
    const dg = new DataGram()

    dg.addField(new DissapatedField("test1", "test12345", "test12"))
    dg.addField(new DissapatedField("test24", "test123", "test6422"))
    
    const result = await dg.build()

    console.log(result)

    return result 
})