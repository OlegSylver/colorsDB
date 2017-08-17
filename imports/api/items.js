import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base'

export const dbColors = new Mongo.Collection('dbColors');

if (Meteor.isServer) {
  // This code only runs on the server

  // Accounts.createUser(
  //           {
  //               username: 'admin',
  //               password: '11111',
  //               profile: {
  //                   firstName: 'Oleg',
  //                   lastName: 'Yuom',
  //                   gender: 'M'
  //               },
  //               email: 'oleg@ongoza.com',
  //               offices: ['001', '002']
  //           }
  //       );
  // Only publish tasks that are public or belong to the current user

  Meteor.publish('userList', function (){
    return Meteor.users.find({});
  });

  Meteor.publish('dbColors', function tasksPublication() {
    // console.log("db ="+dbColors.find());
    // console.log("user ="+Meteor.userId()());
    return dbColors.find({
    });
  });
}

Meteor.methods({
  'items.insert'(text) {
    console.log("start insert");
    console.log("user ="+Meteor.user()());
    check(text, String);

    // Make sure the user is logged in before inserting a task
    // if (! this.userId) {
    //   throw new Meteor.Error('not-authorized');
    // }

    dbColors.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  'items.remove'(itemId) {
    check(itemId, String);

    const task = dbColors.findOne(itemId);
    if (task.private && task.owner !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    dbColors.remove(itemId);
  },
  'items.setChecked'(itemId, setChecked) {
    check(itemId, String);
    check(setChecked, Boolean);

    const item = dbColors.findOne(itemId);
    if (item.private && item.owner !== this.userId) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }

    dbColors.update(itemId, { $set: { checked: setChecked } });
  },
  'items.setPrivate'(itemId, setToPrivate) {
    check(itemId, String);
    check(setToPrivate, Boolean);

    const task = dbColors.findOne(itemId);

    // Make sure only the task owner can make a task private
    if (task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    dbColors.update(itemId, { $set: { private: setToPrivate } });
  },
});
