'use strict';

const assert = require('assert');

const parallel = require('mocha.parallel');
const Aigle = require('../../');
const DELAY = require('../config').DELAY;

parallel('each', () => {

  it('should execute on parallel', () => {

    const order = [];
    const tasks = [1, 4, 2];
    const iterator = (value, key) => {
      return new Aigle(resolve => setTimeout(() => {
        order.push([key, value]);
        return resolve(value);
      }, DELAY * value));
    };
    return Aigle.each(tasks, iterator)
      .then(res => {
        assert.deepEqual(res, undefined);
        assert.deepEqual(order, [
          [0, 1],
          [2, 2],
          [1, 4]
        ]);
      });
  });

  it('should execute with object tasks on parallel', () => {
    const order = [];
    const tasks = {
      task1: 1,
      task2: 4,
      task3: 2
    };
    const iterator = (value, key) => {
      return new Aigle(resolve => setTimeout(() => {
        order.push([key, value]);
        return resolve(value);
      }, DELAY * value));
    };
    return Aigle.each(tasks, iterator)
      .then(res => {
        assert.deepEqual(res, undefined);
        assert.deepEqual(order, [
          ['task1', 1],
          ['task3', 2],
          ['task2', 4]
        ]);
      });
  });

});

parallel('#each', () => {

  it('should execute on parallel', () => {

    const order = [];
    const tasks = [1, 4, 2];
    const iterator = (value, key) => {
      return new Aigle(resolve => setTimeout(() => {
        order.push([key, value]);
        return resolve(value);
      }, DELAY * value));
    };
    return Aigle.resolve(tasks)
      .each(iterator)
      .then(res => {
        assert.deepEqual(res, undefined);
        assert.deepEqual(order, [
          [0, 1],
          [2, 2],
          [1, 4]
        ]);
      });
  });

  it('should execute with object tasks on parallel', () => {
    const order = [];
    const tasks = {
      task1: 1,
      task2: 4,
      task3: 2
    };
    const iterator = (value, key) => {
      return new Aigle(resolve => setTimeout(() => {
        order.push([key, value]);
        return resolve(value);
      }, DELAY * value));
    };
    return Aigle.resolve(tasks)
      .each(iterator)
      .then(res => {
        assert.deepEqual(res, undefined);
        assert.deepEqual(order, [
          ['task1', 1],
          ['task3', 2],
          ['task2', 4]
        ]);
      });
  });

});
