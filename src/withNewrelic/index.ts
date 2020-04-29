import * as newrelic from 'newrelic';
import { testBed } from '../TestBed';

module.exports.handler = newrelic.setLambdaHandler(testBed.runTestBed.bind(testBed));
