import { createReadStream } from "fs";
import { parse } from "papaparse";

class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;

        // This will get printed first before `greet()`
        const name = "John";
        console.log(name);

        const dataProvider = function (filepath) {
            const file = createReadStream(filepath);
            return new Promise((resolve, reject) => {
                parse(file, {
                    header: true,
                    complete(results, file) {
                        // To simulate async processing (reading file)
                        setTimeout(() => {
                            resolve(results.data);
                        }, 3000);
                    },
                    error(err, file) {
                        reject(err);
                    },
                });
            });
        };

        const dataConsumer = async function () {
            try {
                const data = await dataProvider("./people.csv");
                console.log(data);
                console.log(typeof data);
            } catch (err) {
                console.error("Could not parse json", err);
            }
        };
        dataConsumer();
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");
console.log(greeter.greet());

/* -------------------------------
Outputs:

John
Hello, world
[
  { Name: 'Alice', Age: '20' },
  { Name: 'Bob', Age: '21' },
  { Name: 'George', Age: '22' }
]
object
--------------------------------- */
