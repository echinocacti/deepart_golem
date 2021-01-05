import path from "path";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Engine, Task, utils, vm, WorkContext } from "yajsapi";
import { program } from "commander";

dayjs.extend(duration);

const { asyncWith, logUtils, range } = utils;

async function main(subnetTag: string, hash: string, cpu: number, memory: number, storage:number, cimg : string, simg : string) {
  if (cpu == undefined || Number.isNaN(cpu)) {
    cpu = 1;
  }

  if (memory == undefined || Number.isNaN(memory)) {
    memory = 1;
  }

  if (storage == undefined || Number.isNaN(storage)) {
    storage = 2;
  }

  console.log("subnet=", subnetTag);
  console.log("hash=", hash);
  console.log("cpu=", cpu);
  console.log("memory=", memory);
  console.log("storage=", storage);

  const _package = await vm.repo(hash, memory, storage, cpu);  

  async function* worker(ctx, tasks) {
    ctx.send_file(
      path.join(__dirname, cimg),
      "/golem/resource/source.jpg"
    );
    for await (let task of tasks) {
      ctx.run("/golem/entrypoints/run.sh");
      ctx.download_file(
        `/golem/output/deepart.png`,
        path.join(__dirname, `./public/deepart.png`)
      );
      yield ctx.commit();
      // TODO: Check
      // job results are valid // and reject by:
      // task.reject_task(msg = 'invalid file')
      task.accept_task("deepart.png");
    }
    return;
  }

  const frames = range(0, 60, 10);
  const timeout = dayjs.duration({ minutes: 15 }).asMilliseconds();

  await asyncWith(
    await new Engine(
      _package,
      6,
      timeout, //5 min to 30 min
      "10.0",
      undefined,
      subnetTag,
      (event) => {
        console.debug(event);
      }
    ),
    async (engine) => {
      for await (let task of engine.map(
        worker,
        frames.map((frame) => new Task(frame))
      )) {
        console.log("result=", task.output());
      }
    }
  );
  return;  
}

function parseIntParam(value: string) {
  return parseInt(value);
}

program
  .option('--subnet-tag <subnet>', 'set subnet name', 'community.3')
  .option('-d, --debug', 'output extra debugging')
  .requiredOption('-h, --hash <hash>', 'golem VM image hash', 'd03ee08d401facca246a94cfe97c9efb0c802591fad1bfdef2c024db')
  .option('-c, --cpu <number>', '# of cores required', parseIntParam)
  .option('-m, --memory <number>', 'GB of memory required', parseIntParam)
  .option('-s, --storage <number>', 'GB of storage required', parseIntParam)
  .requiredOption('-cimg <path>', 'path to content image')
  .requiredOption('-simg <path>', 'path to style image')
program.parse(process.argv);
if (program.debug) {
  utils.changeLogLevel("debug");
}

console.log(`Using subnet: ${program.subnetTag}`);
main(program.subnetTag, program.hash, program.cpu, program.memory, program.storage, program.cimg, program.simg);