import raf from "./tempPolyfills"
const Enzyme = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')


// Setup enzyme's react adapter
Enzyme.configure({ adapter: new Adapter() })