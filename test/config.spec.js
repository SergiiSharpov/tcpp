const assert = require('assert');
const {FileAPI, ConfigAPI} = require('./../lib/index');


const filename = './cpp/config/some.config.json';

const expectedWindowsTest01 = JSON.stringify({
  include: [],
  libs: [ 'testLib' ],
  libFolder: [],
  main: 'some.cpp',
  src: '',
  out: { base: 'windowsOut', name: 'app', target: 'exe' }
}, null, 2);

const expectedWindowsPlatformTask = JSON.stringify({
  include: [],
  libs: [],
  libFolder: [],
  main: 'main.cpp',
  src: '',
  out: { base: 'outBase', name: 'windowsApp', target: 'exe' }
}, null, 2);

const expectedAndroidPlatformTask = JSON.stringify({
  include: [],
  libs: [],
  libFolder: [],
  main: 'andr.cpp',
  src: '',
  out: { base: 'outMobile', name: 'app', target: 'apk' }
}, null, 2);

describe('Config Parser API', () => {
  let json = null;

  before((done) => {
    FileAPI.loadFile(filename)
    .then(data => {
      json = JSON.parse(data);
      done();
    })
    .catch(done);
  });

  describe('#ConfigParser', () => {
    
    it(`Check windows config for task01`, () => {
      const config = new ConfigAPI.ConfigParser(json);
      config.setTarget("windows");
      config.setTask("task01");

      assert.strictEqual(JSON.stringify(config.task, null, 2), expectedWindowsTest01);
    });

    it(`Check windows config for platformTask`, () => {
      const config = new ConfigAPI.ConfigParser(json);
      config.setTarget("windows");
      config.setTask("platformTask");

      assert.strictEqual(JSON.stringify(config.task, null, 2), expectedWindowsPlatformTask);
    });

    it(`Check android config for platformTask`, () => {
      const config = new ConfigAPI.ConfigParser(json);
      config.setTarget("android");
      config.setTask("platformTask");

      assert.strictEqual(JSON.stringify(config.task, null, 2), expectedAndroidPlatformTask);
    });
  });
});