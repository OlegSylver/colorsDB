import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base'

export const dbColors = new Mongo.Collection('dbColors');

if (Meteor.isServer) { // This code only runs on the server
  if ( Meteor.users.find().count() === 0 ) {
    Accounts.createUser({
                username: 'admin',
                password: '11111',
                profile: {
                    firstName: 'Oleg',
                    lastName: 'Yuom',
                    gender: 'M'
                },
                email: 'oleg@ongoza.com',
                offices: ['001', '002']
            });}

  Meteor.publish('dbColors', function tasksPublication() {
    return dbColors.find({});
  });
}

Meteor.methods({
  'items.remove'(itemId) {dbColors.remove(itemId);},
  'items.setChecked'(itemId, setChecked) {
    check(setChecked, Boolean);
    dbColors.update(itemId, { $set: { checked: setChecked } });
  },

});
