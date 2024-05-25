import { stdin, stdout } from "process";

import { execSync } from "child_process";
import readline from "readline";

// Create a readline interface to read user input
const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

const examples = [
  { id: 1, name: "Create Market", fileName: "create-market" },
  { id: 2, name: "Airdrop Test Tokens", fileName: "airdrop-test-keypairs" },
  { id: 3, name: "Create Open Orders Account ", fileName: "create-oo-account" },
  { id: 4, name: "Place Bid Order ", fileName: "place_bid" },
  { id: 5, name: "Place Ask Order", fileName: "place_ask" },
  { id: 6, name: "Cancel Order", fileName: "cancel-order" },
  { id: 7, name: "Finalise Order", fileName: "finalise" }, 
  { id: 8, name: "Settle Funds", fileName: "settle-funds" },
  { id: 9, name: "View Eevent Heap", fileName: "view-events" },
  { id: 10, name: "View Open Orders", fileName: "view-open-orders" },
  { id: 11, name: "View Orderbook", fileName: "view-orderbook" },
  { id: 12, name: "Finalise Direct", fileName: "finalise-direct" },
];

// Render the options for the user to select from
const renderOptions = examples.map((e) => `${e.id}. ${e.name} `).join("\n");


// Function to execute examples files using ts-node command
async function executeFile(filename: string) {
  const command = `npx ts-node ./examples/${filename}.ts`;
  try {
    console.log(
      "--------------------------------------------------------------------"
    );
    console.log(`[ Executing ] : '${command}'`);
    const output = execSync(command).toString();
    console.log(output);
  } catch (e: any) {
    console.error(e);
  } finally {
    console.log(
      "--------------------------------------------------------------------"
    );
  }
}

let running = true;

// Function to ask user to select an example to run
async function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Function to run examples
async function runExamples() {
  while (running) {
    const answer = await askQuestion(
      `----\n${renderOptions}\n----\nEnter the serial number of an example (or 'stop' to exit): `
    );
    if (Number(answer) && Number(answer) > examples.length) {
      console.log(
        "--------------------------------------------------------------------"
      );

      console.warn(
        "[ Invalid Input ] Please enter the serial number of the examples above."
      );
      console.log(
        "--------------------------------------------------------------------"
      );
      continue;
    }
    if (answer.toLowerCase() === "stop") {
      running = false;
      rl.close();
    } else {
      executeFile(examples.find(eg => eg.id.toString() == answer)?.fileName ?? '');
    }
  }
}

runExamples();
