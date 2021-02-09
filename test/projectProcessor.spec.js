const assert = require('assert');
const {FileAPI, ProcessorAPI} = require('./../lib/index');


const filename = './cpp/include/frustum.h';
const localIncludes = ['bbox.h', 'math_types.h', 'plane.h', 'transform.h'];
const globalIncludes = ['bbox_extruded.h', 'array'];

describe('Parser API', () => {
  let rootNode = null;

  before((done) => {
    FileAPI.loadFile(filename)
    .then(data => {
      rootNode = ProcessorAPI.parseText(data);
      done();
    })
    .catch(done);
  });

  describe('#parseText()', () => {
    
    it(`Total includes count is 6`, () => {
      assert.strictEqual(rootNode.children.size, 6);
    });

    it(`Global includes count is 2`, () => {
      assert.strictEqual(rootNode.getGlobalNodes().length, 2);
    });

    it(`Local includes count is 4`, () => {
      assert.strictEqual(rootNode.getLocalNodes().length, 4);
    });

    it(`Global includes names check`, () => {
      for (let node of rootNode.getGlobalNodes()) {
        assert.notStrictEqual(globalIncludes.indexOf(node.name), -1);
      }
    });

    it(`Local includes names check`, () => {
      for (let node of rootNode.getLocalNodes()) {
        assert.notStrictEqual(localIncludes.indexOf(node.name), -1);
      }
    });
  });
});