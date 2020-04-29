import * as request from 'request-promise';
import * as moment from 'moment';

let numReq: number;

function sleep(timeMs: number): Promise<void> {
  if(timeMs < 0) {
    return Promise.resolve();
  }
  return new Promise((resolve) => setTimeout(resolve, timeMs));
}

function makeRandomURISuffix(length: number): string {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function doWork(uri: string | undefined, rpm: number, timeS: number): Promise<void> {
  console.log('params', { uri, rpm, timeS });
  let done = false;
  sleep(timeS * 1000).then(() => {
    done = true;
  });
  const timeMsBetweenRequests = 1/(rpm/(60*1000));
  while(!done) {
    const beforeReq = moment.now();
    const endpoint = uri || 'https://replacethis.com/' + makeRandomURISuffix(8); //todo replace with endpoint, ideally a simple webserver w/o rate limiting enforced w/ parameterized route that gives back 404
    await request.get(endpoint).catch((err) => {
      if (err.statusCode !== 404) {
        console.error('non 404 request-promise-rejection');
        throw err;
      }
    });
    // console.log('finished request to ' + endpoint);
    numReq++;
    await sleep(timeMsBetweenRequests - moment().diff(beforeReq, 'ms'));
  }
}

async function handle (): Promise<string> {
  const env = {
    uri: process.env.URI,
    rpm: parseInt(process.env.RPM || '0'),
    timeDoingWork: parseInt(process.env.TIME_DOING_WORK || '0')
  };
  numReq = 0;
  const reqTracker = setInterval(() => {
    console.log('num requests: ', numReq);
  }, 5000);
  console.log(`doing work for ${env.timeDoingWork} seconds`);
  await doWork(env.uri, env.rpm, env.timeDoingWork);
  clearInterval(reqTracker);
  console.log('final request count: ', numReq);
  console.log('done');
  return 'done';
}

module.exports.handler = handle;
