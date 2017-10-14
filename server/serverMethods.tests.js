import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';
import {dbColors} from  './main.js';

if (Meteor.isServer) {
  describe('dbColors', () => {
    describe('methods', () => {
      let setChecked = false, itemId
      let startCount = dbColors.find().count()
      it('check items.insert method', () => {
        itemId = Meteor.call('items.insert',{name:'test',checked:setChecked})
        assert.isString(itemId,"New data id is string.");
      })
      setChecked = !setChecked
      it('check items.setChecked method', () => {
       let setCheckedResult = Meteor.call('items.setChecked',itemId,setChecked)
          let result = dbColors.findOne({_id:itemId}, {fields: {'checked': 1}})
            console.log("test result=",result.checked)
            assert.equal(result.checked,setChecked,"Data from DB is equal to test data.");
        });
      it('check items.remove method', () => {
          let resDelete = dbColors.remove(itemId)
          let count = dbColors.find().count()
          assert.equal(count,startCount,"Items number before is equal after.");
        })

     })})}
