# Blue Diamond
A library changing the way javascript will be used for data analysis

## Installation
```cmd
npm i @rexysaur/bluediamond [options]
```

<br />

## Contribution
We would love to have some contribution to make the library better and more efficient. 

If you are having any issues list them at the [issues page](https://github.com/mikael-chowdhury/bluediamond/issues) on github

<br />

## Documentation
We don't have any official documentation as of now, 
but here is a quick rundown of all of the major parts of the library

<br />

## Index
  - [Project](#project)
  - [DataGram](#datagram)
  - [Table](#table)
  - [Title](#title)
  - [Field](#field)
  - [Dissapated Field](#dissapated-field)

<br />

## Project
This class is a basic wrapper for your entire script. Since this library is asynchronous, the project's run function takes in an asynchronous function which gives you access to all of the libraries async functions with ease.

basic example:
```ts
const { Project } = require("@rexysaur/bluediamond")

new Project().run(async () => {
    // ... code
})
```

<br />

## DataGram
DataGram is a class that holds [Fields](##Field) and builds them into a final [String](https://tinyurl.com/ojb2qd5).

basic example:
```ts
const { Project, DataGram, Field } = require("@rexysaur/bluediamond")

new Project().run(async () => {
    const dg = new DataGram()

    const result = await dg.build()

    console.log(result)

    return result
})
```

<br />

## Table
Table is a class that holds [Fields](##Field) as rows and uses strings for coloumns. A table is to be built independantly which converts all of the rows to strings and formats them. This is done to keep data isolated in seperate areas in the script, making errors easier to debug.

basic example:
```ts
const { Project, DataGram, Table, DissapatedField } = require("@rexysaur/bluediamond")

new Project().run(async () => {
    const dg = new DataGram()

    const table = new Table()
    table.addColoumn("fruits").addColoumn("vegetables")
    table.addRow(new DissapatedField("apples", "peppers"))
    table.addRow(new DissapatedField("bananas", "onion"))

    await table.build()
    table.appendToDataGramMatrix(dg)
    
    const result = await dg.build()

    console.log(result)

    return result
})

/**
 * expected output:
 * 
 * fruits      vegetables
 * ------------------------
 * apples      peppers
 * bananas     onion
 * 
```

<br />

## Title
Title is a class which extends [FieldArray](##FieldArray) and is in basic terms, creates an array of fields which make it look more appealing and readable

basic example:

```ts
const { Project, Title, DataGram } = require("@rexysaur/bluediamond")

new Project().run(async () => {
    const dg = new DataGram()

    new Title("test").appendToDataGramMatrix(dg)
    
    const result = await dg.build()

    console.log(result)

    return result 
})

/**
 * expected output:
 * 
 * ---------
 * test
 * ---------
 * 
```

<br />

## Field
the Field class is a fundamental. Bluediamond is a framework which uses fields to create an output. A Field is a [String](https://tinyurl.com/ojb2qd5) wrapper which converts an any[] to a string[]

basic example:
```ts
const { Project, DataGram, Field } = require("@rexysaur/bluediamond")

new Project().run(async () => {
    const dg = new DataGram()

    dg.addField(new Field("test", "test1", "test2"))
    
    const result = await dg.build()

    console.log(result)

    return result 
})

/**
 * expected output
 * 
 * test test1 test2
 *
```

<br />

## Dissapated Field
a Dissapated Field is a [Field](##Field) wrapper which the [DataGram](##DataGram) compiler recognises and spreads according to other Dissapated Fields appended to the same [DataGram](##DataGram).

basic example:

```ts
const { Project, DataGram, Field, DissapatedField } = require("@rexysaur/bluediamond")

new Project().run(async () => {
    const dg = new DataGram()

    dg.addField(new DissapatedField("test1", "test12345", "test12"))
    dg.addField(new DissapatedField("test24", "test123", "test6422"))
    
    const result = await dg.build()

    console.log(result)

    return result 
})

/**
 * expected output:
 * 
 * test1      test12345     test12
 * test24     test123       test6422
 * 
```

<br />

### **This is not a complete documentation of the project**
### There is a lot of minor features of the BlueDiamond project that can be found [here](/src/bluediamond/lib/)
