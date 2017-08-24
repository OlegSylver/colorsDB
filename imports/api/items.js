import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

if (!Meteor.isServer) { export const dbColors = new Mongo.Collection('dbColors');}
