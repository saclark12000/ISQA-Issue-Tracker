/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

var Issue = require('../models/issue.js');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/hamster')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          assert.equal(res.body.open, true);
          Issue.deleteMany({ created_by: 'Functional Test - Every field filled in' }, (err)=> { });
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/hamster')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Required fields filled in'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Required fields filled in');
          assert.equal(res.body.open, true);
          Issue.deleteMany({ created_by : "Functional Test - Required fields filled in" }, (err)=> { });
          done();
        });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post('/api/issues/hamster')
        .send({
          issue_text: 'text',
          created_by: 'Functional Test - Missing required fields'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.errors.issue_title.name, 'ValidatorError');
          done();
        });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/hamster')
        .send({
          _id : '5d015a2fb1598a01c3777e46'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'No update field sent for 5d015a2fb1598a01c3777e46')
          done();
        });
        
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/hamster')
        .send({
          _id : '5d015a2fb1598a01c3777e46',
          status_text: 'One field to update'       
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'Successfuly updated 5d015a2fb1598a01c3777e46');
          done();
        });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/hamster')
        .send({
          _id : '5d015a2fb1598a01c3777e46',
          issue_text: 'Multiple fields to update',
          status_text: 'Multiple fields to update'       
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'Successfuly updated 5d015a2fb1598a01c3777e46');
          done();
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/hamster')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/hamster')
        .query({open: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });        
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/hamster')
        .query({open: true, assigned_to: 'QA'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });  
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/hamster')
        .send({
          _id : ''      
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'Id  not valid');
          done();
        });
      });
      
      test('Valid _id', function(done) {
        //5d015a6fde30bb022f388dd9
        chai.request(server)
         .post('/api/issues/hamster')
         .send({
          _id : '5d015a6fde30bb022f388dd9',
          issue_title: 'Delete Me',
          issue_text: 'Delete Me',
          created_by: 'Functional Test - Valid Id deletion',
          assigned_to: 'QA',
          status_text: 'Delete Me'
        })
        .end(function(err, res){
          chai.request(server)
            .delete('/api/issues/hamster')
            .send({
              _id : '5d015a6fde30bb022f388dd9'      
            })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.text, '5d015a6fde30bb022f388dd9 has been deleted.');
              done();
            });
      });
    });
  });
});