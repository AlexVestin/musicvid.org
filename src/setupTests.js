import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-canvas-mock';

class Worker {
    constructor(stringUrl) {
      this.url = stringUrl;
      this.onmessage = () => {};
    }

    postMessage(msg) {
      this.onmessage(msg);
    }
}

window.Worker = Worker;
configure({ adapter: new Adapter() });