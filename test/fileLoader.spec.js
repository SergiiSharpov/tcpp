const assert = require('assert');
const {FileAPI} = require('./../lib/index');


const filename = './cpp/simple/main.cpp';
const brokenFilename = './cpp/some.cpp';
const fileContentLength = 277;

describe('File API', () => {

  describe('#loadFile()', () => {
    it('Should load existing file without errors', (done) => {
      FileAPI.loadFile(filename)
      .then(() => done())
      .catch(done)
    });

    it('Should reject on loading file that doesn\'t exists', (done) => {
      FileAPI.loadFile(brokenFilename)
      .then(() => done('Something gone wrong'))
      .catch(() => done())
    });

    it(`Should return file content length (${fileContentLength} symbols)`, (done) => {
      FileAPI.loadFile(filename)
      .then((data) => {
        assert.strictEqual(data.length, fileContentLength);
        done()
      })
      .catch(done)
    });
  });

  describe('#loadFileSync()', () => {
    it('Should load existing file and return not null', () => {
      assert.notStrictEqual(
        FileAPI.loadFileSync(filename),
        null
      );
    });

    it('Should reject on loading file that doesn\'t exists and return null', () => {
      assert.strictEqual(
        FileAPI.loadFileSync(brokenFilename),
        null
      );
    });

    it(`Should return file content length (${fileContentLength} symbols)`, () => {
      assert.strictEqual(
        FileAPI.loadFileSync(filename).length,
        fileContentLength
      );
    });
  });

});