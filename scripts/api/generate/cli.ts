import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { timingGenerate } from ".";

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option("timing", {
      alias: "t",
      describe: "Timed generation (minutes)",
    })
    .option("env", {
      describe: "Packaged environment",
    })
    .help().argv;

  console.log(argv);

  timingGenerate({
    timing: argv.timing as boolean | number,
    env: argv.env as string,
  });
}

main();
