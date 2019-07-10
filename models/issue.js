'use strict';

var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId;

var issueSchema = new mongoose.Schema({
  _id : { type : mongoose.Schema.Types.ObjectId, default : ObjectId },
  issue_title : { type : String, required: true },
  issue_text : { type : String, required: true }, 
  created_by : { type : String, required: true }, 
  assigned_to : String,
  status_text : String,
  created_on : { type: Date, default: Date.now },
  updated_on : { type: Date, default: Date.now },
  open: {type: Boolean, default: true, required: true}
  });

module.exports = mongoose.model("Issue", issueSchema);