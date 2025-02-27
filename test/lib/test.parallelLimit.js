'use strict';

const assert = require('assert');

const parallel = require('mocha.parallel');
const Aigle = require('../../');
const util = require('../util');
const { DELAY } = require('../config');

parallel('parallelLimit', () => {
  it('should execute', () => {
    const order = [];
    const delay = util.makeDelayTask(order);
    const tasks = [delay('test1', DELAY * 3), delay('test2', DELAY * 2), delay('test3', DELAY * 1)];
    return Aigle.parallelLimit(tasks).then(res => {
      assert.deepStrictEqual(res, ['test1', 'test2', 'test3']);
      assert.deepStrictEqual(order, ['test3', 'test2', 'test1']);
    });
  });

  it('should execute with array function tasks', () => {
    const tasks = [
      () => Aigle.delay(DELAY * 3, 'test1'),
      Aigle.delay(DELAY * 2, 'test2'),
      () => 'test3'
    ];
    return Aigle.parallelLimit(tasks).then(res => {
      assert.deepStrictEqual(res, ['test1', 'test2', 'test3']);
    });
  });

  it('should execute with object tasks', () => {
    const order = [];
    const delay = util.makeDelayTask(order);
    const tasks = {
      task1: () => delay('test1', DELAY * 3),
      task2: () => delay('test2', DELAY * 2),
      task3: () => delay('test3', DELAY * 1)
    };
    return Aigle.parallelLimit(tasks).then(res => {
      assert.deepStrictEqual(res, {
        task1: 'test1',
        task2: 'test2',
        task3: 'test3'
      });
      assert.deepStrictEqual(order, ['test3', 'test2', 'test1']);
    });
  });

  it('should execute with object tasks and limit', () => {
    const order = [];
    const delay = util.makeDelayTask(order);
    const tasks = {
      task1: () => delay('test1', DELAY * 5),
      task2: () => delay('test2', DELAY * 3),
      task3: () => delay('test3', DELAY * 1)
    };
    return Aigle.parallelLimit(tasks, 2).then(res => {
      assert.deepStrictEqual(res, {
        task1: 'test1',
        task2: 'test2',
        task3: 'test3'
      });
      assert.deepStrictEqual(order, ['test2', 'test3', 'test1']);
    });
  });

  it('should execute with object function tasks', () => {
    const tasks = {
      task1: () => Aigle.delay(DELAY * 3, 'test1'),
      task2: Aigle.delay(DELAY * 2, 'test2'),
      task3: 'test3'
    };
    return Aigle.parallelLimit(tasks).then(res => {
      assert.deepStrictEqual(res, {
        task1: 'test1',
        task2: 'test2',
        task3: 'test3'
      });
      assert.deepStrictEqual(Object.keys(res), ['task1', 'task2', 'task3']);
    });
  });

  it('should ensure object property order', () => {
    const tasks = {
      task1: Aigle.delay(DELAY * 3, 'test1'),
      task2: Aigle.delay(DELAY * 2, 'test2'),
      task3: Aigle.delay(DELAY * 1, 'test3')
    };
    return Aigle.parallelLimit(tasks).then(res => {
      assert.deepStrictEqual(res, {
        task1: 'test1',
        task2: 'test2',
        task3: 'test3'
      });
      assert.deepStrictEqual(Object.keys(res), ['task1', 'task2', 'task3']);
    });
  });

  it('should work with a Set instance', () => {
    const order = [];
    const delay = util.makeDelayTask(order);
    const tasks = new Set([delay(1, DELAY * 3), delay(2, DELAY * 2), delay(3, DELAY * 1)]);
    return Aigle.parallelLimit(tasks).then(res => {
      assert.deepStrictEqual(res, [1, 2, 3]);
      assert.deepStrictEqual(order, [3, 2, 1]);
    });
  });

  it('should work with a Set instance which has function tasks', () => {
    const order = [];
    const delay = util.makeDelayTask(order);
    const tasks = new Set([
      () => delay(1, DELAY * 3),
      () => delay(2, DELAY * 2),
      delay(3, DELAY * 1) // can't control the execution
    ]);
    return Aigle.parallelLimit(tasks).then(res => {
      assert.deepStrictEqual(res, [1, 2, 3]);
      assert.deepStrictEqual(order, [3, 2, 1]);
    });
  });

  it('should work with a Map instance', () => {
    const order = [];
    const delay = util.makeDelayTask(order);
    const tasks = new Map([
      ['task1', delay(1, DELAY * 3)],
      ['task2', delay(2, DELAY * 2)],
      ['task3', delay(3, DELAY * 1)]
    ]);
    return Aigle.parallelLimit(tasks).then(res => {
      assert.ok(res instanceof Map);
      assert.strictEqual(res.get('task1'), 1);
      assert.strictEqual(res.get('task2'), 2);
      assert.strictEqual(res.get('task3'), 3);
      assert.deepStrictEqual(order, [3, 2, 1]);
    });
  });

  it('should work with a Map instance which has function tasks', () => {
    const order = [];
    const delay = util.makeDelayTask(order);
    const tasks = new Map([
      ['task1', () => delay(1, DELAY * 3)],
      ['task2', () => delay(2, DELAY * 2)],
      ['task3', () => delay(3, DELAY * 1)]
    ]);
    return Aigle.parallelLimit(tasks).then(res => {
      assert.ok(res instanceof Map);
      assert.strictEqual(res.get('task1'), 1);
      assert.strictEqual(res.get('task2'), 2);
      assert.strictEqual(res.get('task3'), 3);
      assert.deepStrictEqual(order, [3, 2, 1]);
    });
  });

  it('should return an empty array immediately', () => {
    return Aigle.parallelLimit([]).then(res => {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
      assert.deepStrictEqual(res, []);
    });
  });

  it('should return an empty object immediately', () => {
    return Aigle.parallelLimit({}).then(res => {
      assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
      assert.deepStrictEqual(res, {});
    });
  });

  it('should return an empty object immediately', () => {
    return Aigle.parallelLimit().then(res => {
      assert.deepStrictEqual(res, {});
    });
  });
});

parallel('#parallelLimit', () => {
  it('should execute', () => {
    const order = [];
    const delay = util.makeDelayTask(order);
    const tasks = [delay('test1', DELAY * 3), delay('test2', DELAY * 2), delay('test3', DELAY * 1)];
    return Aigle.resolve(tasks)
      .parallelLimit()
      .then(res => {
        assert.deepStrictEqual(res, ['test1', 'test2', 'test3']);
        assert.deepStrictEqual(order, ['test3', 'test2', 'test1']);
      });
  });

  it('should execute with object tasks', () => {
    const order = [];
    const delay = util.makeDelayTask(order);
    const tasks = {
      task1: delay('test1', DELAY * 3),
      task2: delay('test2', DELAY * 2),
      task3: delay('test3', DELAY * 1)
    };
    return Aigle.resolve(tasks)
      .parallelLimit()
      .then(res => {
        assert.deepStrictEqual(res, {
          task1: 'test1',
          task2: 'test2',
          task3: 'test3'
        });
        assert.deepStrictEqual(order, ['test3', 'test2', 'test1']);
      });
  });

  it('should execute with object tasks and limit', () => {
    const order = [];
    const delay = util.makeDelayTask(order);
    const tasks = {
      task1: () => delay('test1', DELAY * 5),
      task2: () => delay('test2', DELAY * 3),
      task3: () => delay('test3', DELAY * 1)
    };
    return Aigle.resolve(tasks)
      .parallelLimit(2)
      .then(res => {
        assert.deepStrictEqual(res, {
          task1: 'test1',
          task2: 'test2',
          task3: 'test3'
        });
        assert.deepStrictEqual(order, ['test2', 'test3', 'test1']);
      });
  });

  it('should execute with delay', () => {
    const order = [];
    const delay = util.makeDelayTask(order);
    const tasks = [delay('test1', DELAY * 3), delay('test2', DELAY * 2), delay('test3', DELAY * 1)];
    return Aigle.delay(DELAY, tasks)
      .parallelLimit()
      .then(res => {
        assert.deepStrictEqual(res, ['test1', 'test2', 'test3']);
        assert.deepStrictEqual(order, ['test3', 'test2', 'test1']);
      });
  });

  it('should catch an error', () => {
    const order = [];
    const delay = util.makeDelayTask(order);
    const tasks = [
      () => delay('test1', new Error('error1'), DELAY * 3),
      () => delay('test2', new Error('error2'), DELAY * 2),
      () => delay('test3', null, DELAY * 1)
    ];
    return Aigle.resolve(tasks)
      .parallelLimit()
      .then(() => assert(false))
      .catch(err => {
        assert.ok(err);
        assert.strictEqual(err.message, 'error2');
        assert.deepStrictEqual(order, ['test3', 'test2']);
      });
  });
});
