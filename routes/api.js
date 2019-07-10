/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

var Issue = require('../models/issue.js');

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
    
      var findItems = req.query
      if (findItems.open === 'true'){
        findItems.open = true;
      } else if (findItems.open === 'false') {
        findItems.open = false;
      }
    
      Issue.find(findItems, (err, issues) =>{
        if(err){
          res.send(err);
          return err
        } else {
          res.send(issues);
          return issues
        }
      })
    })
    
    .post(function (req, res){
      var project = req.params;
      var newIssue = req.body;
    
      Issue.create(newIssue, (err, createdIssue)=>{
        if(err){
          res.send(err)
          return err.name
        } else {
          res.send(createdIssue)
          return createdIssue
        }
      })
      
    })
    
    .put(function (req, res){
      var project = req.params.project;
    //put _id into it's own var
    try{
      var id = ObjectId(req.body._id)
      }
    catch (err) {
      res.send(`Could not update ${req.body._id} ${err}`)
      return `Could not update ${req.body._id}`
    }
    //put req.body into it's own var and get rid of empty key/values and _id
      var changes = req.body;
      Object.entries(changes).forEach(([key, value]) => {
        (value == '') ? delete changes[key] : null })
      delete changes._id
      //check if changes is empty and exit if it is
      if (Object.keys(changes).length === 0){  res.send(`No update field sent for ${id}`); return `No update field sent for ${id}`}
      //update updated_on
      changes.updated_on = new Date().toUTCString();
    
      //console.log(id, changes)
    
      Issue.findByIdAndUpdate(id, changes, (err, updatedDoc) =>{
        if (err) {
          res.send('Id not valid');
          return 'Id not valid ' + id
        } else {
          if (updatedDoc === null) {
            res.send('Could not update ' + id);
            return 'Could not update ' + id
          } else {
            res.send('Successfuly updated ' +id);
            return 'Successfuly updated ' +id 
          }
        }
      })
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
    
      Issue.findByIdAndDelete(req.body._id, (err, deletedDoc) =>{
        if (err) {
          res.send('Id '+ req.body._id + ' not valid')
          return 'Id '+ req.body._id + ' not valid'
        } else {
          if (deletedDoc === null) {
            res.send('Id not found')
            return 'Id '+ req.body._id + ' not found.'
          } else {
            res.send(deletedDoc._id + ' has been deleted.')
            return deletedDoc._id + ' has been deleted.'
          }
        }
      })
    
    });
    
};
