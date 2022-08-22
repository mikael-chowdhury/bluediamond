import { DataGram } from "./bluediamond";
import { DissapatedField } from "./bluediamond/lib/DissapatedField";
import { Filter } from "./bluediamond/lib/Filter";
import Project from "./bluediamond/lib/Project";
import { Table } from "./bluediamond/lib/Table";
import { Title } from "./bluediamond/lib/Title";

new Project().run(async () => {
  const dg = new DataGram();

  new Title("Dissipation Field Test").appendToDataGramMatrix(dg);

  const table = new Table();

  await table.fromSAS("./data.sas7bdat");

  table.applyFilter(
    new Filter(
      "Revenue",
      (revenue) => parseInt(revenue) > 0 && parseInt(revenue) <= 10000
    )
  );

  await table.build();

  table.appendToDataGramMatrix(dg);

  const result = await dg.build();

  return result;
});
