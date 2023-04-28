import { msgLog } from '@utils/logging';
import { onMessage } from '@src/utils/messaging';
import { setupScriptInjector } from './script-injector';

msgLog('Worker running');

onMessage('msgType', () => {});

setupScriptInjector();
