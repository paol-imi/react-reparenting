// setup file.
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import './__shared__/warningMock';

configure({adapter: new Adapter()});
