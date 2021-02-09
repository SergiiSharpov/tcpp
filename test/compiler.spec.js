const assert = require('assert');
const path = require('path');
const {ParserAPI} = require('./../lib/index');


const projectDir = './cpp/Samples/Sample05';
const taskName = "build";
const secondValidConfigName = 'config.example.json';

const brokenProjectDir = './cpp/code-master/test-broken-dir';
const brokenTaskName = "build01";
const brokenTarget = 'someNewOS';
const brokenConfigName = 'config.invalid.json';

const expectedSources = [
  "Main.cpp",
  "Actor.cpp",
  "Asteroid.cpp",
  "CircleComponent.cpp",
  "Component.cpp",
  "Game.cpp",
  "InputComponent.cpp",
  "Laser.cpp",
  "Math.cpp",
  "MoveComponent.cpp",
  "Random.cpp",
  "Shader.cpp",
  "Ship.cpp",
  "SpriteComponent.cpp",
  "Texture.cpp",
  "VertexArray.cpp"
];

const expectedCompileResult = {
  command: 'g++',
  args: [
    '--std',
    'c++11',
    '..\\Main.cpp',
    '..\\Actor.cpp',
    '..\\Asteroid.cpp',
    '..\\CircleComponent.cpp',
    '..\\Component.cpp',
    '..\\Game.cpp',
    '..\\InputComponent.cpp',
    '..\\Laser.cpp',
    '..\\Math.cpp',
    '..\\MoveComponent.cpp',
    '..\\Random.cpp',
    '..\\Shader.cpp',
    '..\\Ship.cpp',
    '..\\SpriteComponent.cpp',
    '..\\Texture.cpp',
    '..\\VertexArray.cpp',
    '-I..\\include',
    '-L..\\lib',
    '-lglew32',
    '-lSOIL',
    '-lmingw32',
    '-lSDL2Main',
    '-lSDL2',
    '-lSDL2_image',
    '-o',
    'app.exe'
  ],
  directory: 'cpp\\Samples\\Sample05\\windowsOut'
}

expectedCompileResult.args = expectedCompileResult.args.map(arg => path.normalize(arg));
expectedCompileResult.directory = path.normalize(expectedCompileResult.directory);


describe('Compiler API', () => {
  describe('#ParserAPI.parse()', () => {

    it(`Check wrong directory`, () => {
      const data = ParserAPI.parse(brokenProjectDir, taskName);
      assert.strictEqual(data, false);
    });

    it(`Check wrong task name`, () => {
      const data = ParserAPI.parse(projectDir, brokenTaskName);
      assert.strictEqual(data, false);
    });

    it(`Check wrong target`, () => {
      const data = ParserAPI.parse(projectDir, taskName, brokenTarget);
      assert.strictEqual(data, false);
    });

    it(`Check wrong config name`, () => {
      const data = ParserAPI.parse(projectDir, taskName, null, brokenConfigName);
      assert.strictEqual(data, false);
    });

    it(`Check correct parse`, () => {
      const data = ParserAPI.parse(projectDir, taskName);
      assert.notStrictEqual(data, false);
    });

    it(`Check correct config name`, () => {
      const data = ParserAPI.parse(projectDir, taskName, null, secondValidConfigName);
      assert.notStrictEqual(data, false);
    });
  });

  describe('#ProjectParser process', () => {

    it(`Check correct sources with autoSrc`, () => {
      const data = ParserAPI.parse(projectDir, taskName);
      const parseSuccess = data.process();

      if (parseSuccess) {
        const actualSources = [];

        for (let [key] of data.sources) {
          actualSources.push(path.relative(projectDir, key));
        }

        assert.deepStrictEqual(actualSources, expectedSources);
      } else {
        assert.fail('Project parsing fail');
      }
    });

    it(`Check correct sources without autoSrc`, () => {
      const data = ParserAPI.parse(projectDir, taskName);
      const parseSuccess = data.process();

      if (parseSuccess) {
        const actualSources = [];

        for (let [key] of data.sources) {
          actualSources.push(path.relative(projectDir, key, null, secondValidConfigName));
        }

        assert.deepStrictEqual(actualSources, expectedSources);
      } else {
        assert.fail('Project parsing fail');
      }
    });

  });

  describe('#ProjectParser compile', () => {

    it(`Check correct cli command compilation`, (done) => {
      const data = ParserAPI.parse(projectDir, taskName);
      const parseSuccess = data.process();

      if (parseSuccess) {
        let compileSuccess = data.compile();

        if (compileSuccess) {
          done();
        } else {
          assert.fail('Project compilation fail');
        }
      } else {
        assert.fail('Project parsing fail');
      }
    });

    it(`Check correct cli command result`, () => {
      const data = ParserAPI.parse(projectDir, taskName);
      const parseSuccess = data.process();

      if (parseSuccess) {
        let compileSuccess = data.compile();

        if (compileSuccess) {
          const build = {...data.build};

          build.args = build.args.map(arg => path.normalize(arg));
          build.directory = path.normalize(build.directory);
          
          assert.deepStrictEqual(build, expectedCompileResult);
        } else {
          assert.fail('Project compilation fail');
        }
      } else {
        assert.fail('Project parsing fail');
      }
    });

  });

});