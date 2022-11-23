import express, { Request, Response } from 'express';

const router = express.Router();
const baseFolder = process.env.BASE_DESTINATION_FOLDER!;

router.get('/isReady', (req: Request, res: Response) => {

  const instances = getRunningInstancesUrls();
  const instanceId = req.query.instance_id as string | undefined;

  if(!instanceId) {
    res.status(400).send('Missing instance_id');
    return;
  }

  if(instances.length === 1) {
    const instance = instances[0];
    res.status(200).send({
      status: "ok",
      redirectUrl: getRedirectUrl(instance, instanceId)
    });
  }
  else if(instances.length > 1) {
    res.status(500).send('Too many instances running');
  }
  else {
    res.status(200).send(JSON.stringify({
      status: 'working',
    }));
  }
});

function getRunningInstancesUrls():string[] {
  if(process.env.MACHINE==='mock') {
    const response = getStdoutFromCommand(`ls ${baseFolder}/instances`);
    const lines = response.split("\n");
    lines.pop(); // remove last empty line
    return lines.map((line:string) => `http://localhost:8888/?token=${line}`);
  }
  else 
  {
   const response = getStdoutFromCommand(`jupyter notebook list`);
   let lines = response.split("\n");
   const urls  = lines.map((line:string) => line.split(" ")[0]);
   return urls;
  }
}

function getStdoutFromCommand(command: string) {
    const { execSync } = require('child_process');
    const stdout = execSync(command, { encoding: 'utf-8' });
    return stdout;
}

function getRedirectUrl(jupyterUrl: string, instanceId: string) {
  const { baseUrl, queryParamsObject } = extractBaseUrlAndQueryParams(jupyterUrl);
  const destinationJn = `scjn_${instanceId}.ipynb`;
  return `${baseUrl}lab/tree/${destinationJn}?token=${queryParamsObject.token}`
}



function extractBaseUrlAndQueryParams(url: string) {
  const baseUrl = url.split("?")[0];
  const queryParams = url.split("?")[1];
  const queryParamsArray = queryParams.split("&");
  const queryParamsObject = queryParamsArray.reduce((acc:any, curr) => {
    const [key, value] = curr.split("=");
    acc[key] = value;
    return acc;
  }, {});
  return { baseUrl, queryParamsObject };
}



export default function () {
  return router;
}
