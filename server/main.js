if (Meteor.isServer) { // This code only runs on the server
  if ( Meteor.users.find().count() === 0 ) {
    Accounts.createUser({
                username: 'admin',
                password: '1',
                profile: {
                    firstName: 'Oleg',
                    lastName: 'Sylver',
                    gender: 'M'
                },
                email: 'a@a.com',
                offices: ['001', '002']
            });}
}
const dbTutorials = new Mongo.Collection('dbTutorials');
export const dbColors = new Mongo.Collection('dbColors');

Meteor.publish('dbColors', function tasksPublication() {
  return dbColors.find({});
});

Meteor.publish('dbTutorials', function tasksPublication() {
  return dbTutorials.find({});
});

Meteor.methods({
  'items.insert'(data) { return dbColors.insert(data) },
  'items.remove'(itemId) {
    let res = dbColors.remove(itemId)
    console.log("del=",res)
    return res
  },
  'items.setChecked'(itemId, setChecked) {
    console.log('setChecked=', itemId, setChecked);
    //check(setChecked, Boolean);
    return dbColors.update(itemId, { $set: { checked: setChecked }});
  },

});
