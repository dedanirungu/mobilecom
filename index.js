/**
 * @format
 */

import {
    AppRegistry
} from 'react-native';
import App from './App';
import SMSService from './src/SMSService';
import BackgroundJob from 'react-native-background-job';
import {
    name as appName
} from './app.json';

import {
    openDatabase
} from 'react-native-sqlite-storage';

global.db = openDatabase({
    name: 'mobilecom.db'
});

const smsService = new SMSService();

// Register scheduled background job
BackgroundJob.register({
    jobKey: 'readReceivedSMS',
    job: () => {
        smsService.prepareInComingSMS();
        smsService.forwardInComingSMS();
        smsService.prepareOutGoing();
        smsService.sendOutGoing();
    },
});

BackgroundJob.schedule({
    jobKey: 'readReceivedSMS',
    period: 60 * 1000,
    exact: true,
    allowWhileIdle: true,
    allowExecutionInForeground: true,
});

AppRegistry.registerComponent(appName, () => App);