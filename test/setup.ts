// setup file.
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import './__shared__/warningMock';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
configure({adapter: new Adapter()});
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
global.__DEV__ = true;
