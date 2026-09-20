import test from 'node:test'; import assert from 'node:assert/strict'; import {canCancelOrder} from '../utils/orderRules.js';
test('pending can cancel',()=>assert.equal(canCancelOrder({orderStatus:'PENDING'}),true));
test('shipped cannot cancel',()=>assert.equal(canCancelOrder({orderStatus:'SHIPPED'}),false));
test('delivered cannot cancel',()=>assert.equal(canCancelOrder({orderStatus:'DELIVERED'}),false));
