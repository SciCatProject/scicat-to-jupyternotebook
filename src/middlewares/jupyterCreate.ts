import * as fs from 'fs';

import express, { Request, Response } from 'express';

const router = express.Router();
const baseFolder = process.env.BASE_DESTINATION_FOLDER!;
const jupyterLabCommand = process.env.JUPYTER_LAB_COMMAND || "jupyter lab --no-browser";

router.post('/create', (req: Request, res: Response) => {
  
  createFolderIfNotExist(baseFolder);

  const input = getDataFromrequest(req);
  const outputFolder = `${baseFolder}/${input.instance_id}`;
  createFolderIfNotExist(outputFolder);

  const templateContents = createJupyterFileContents(
    input.instance_id,
    JSON.stringify(input),
    input.username
  );

  createFile(
    `${outputFolder}/scjn_${input.instance_id}.ipynb`,
    templateContents
  );

  const [command, ...parameters] = jupyterLabCommand.split(' ');
  console.log(command);
  console.log(parameters);
  spawnChildProcess(
    command,
    parameters,
    {
      cwd: outputFolder,
      detached: true,
    }
  );

  res.render('create', {
    showTitle: true,
    instance_id: input.instance_id,
  });
});

function escapeCharacters(data: string) {
  return data.replace(/"/g, '\\"');
}

function getDataFromrequest(req: Request) {
  return req.body;
  // return {
  //     "user" : "massimilianonovelli",
  //     "instance_id" : "idce5fec2-6a5e-11ed-9932-874c95750a47",
  //     "datasets" : [
  //       "20.500.12269/99ae086f-62dc-4228-a283-cc1c988c9e59",
  //       "20.500.12269/041e81c7-f96f-4447-bb34-c8047a6425ac",
  //       "20.500.12269/6a67b6e6-a202-4a6c-9859-4fecd6655165",
  //       "20.500.12269/f685a72d-663f-4592-b593-110624d70eb5"
  //     ]
  //   }
}

function spawnChildProcess(
  cmd: string,
  args: string[],
  options: object
) {
  console.log("Spawing subprocess");
  console.log(`Command: ${cmd}`);
  console.log(`Arguments: ${args}`);
  console.log(`Options: ${options}`);
  const { spawn } = require('child_process');
  const ls = spawn(
    cmd,
    args,
    options
  );
}

function createFolderIfNotExist(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

function createFile(path: string, contents: string) {
  fs.writeFile(path, contents, function (err) {
    if (err) throw err;
    console.log(path + 'Saved!');
  });
}

function openJupyter() {
  const { spawn } = require('child_process');
  const ls = spawn('jupyter', ['notebook', '--no-browser', '--port=8888']);
}

function createJupyterFileContents(
  instanceId: string,
  jsonData: string,
  username: string
) {
  let template = fs.readFileSync(`${baseFolder}/scjnt.ipynb`, 'utf8');
  template = findAndReplace(template, '<INSTANCE_ID>', instanceId);
  template = findAndReplace(
    template,
    '<SCICAT_DATA>',
    escapeCharacters(jsonData)
  );
  template = findAndReplace(template, '<<USERNAME>>', username);

  return template;
}

function findAndReplace(data: string, toReplace: string, replaceWith: string) {
  // ts-ignore
  return data.split(toReplace).join(replaceWith);
}

export default function () {
  return router;
}
