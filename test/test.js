const chai = require('chai');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const fs = require('node:fs');
const expect = chai.expect;

app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

before(()=>{
    require('dotenv').config()
})

const createCategory = require('../controllers/category/createCategory');
const updateCategory = require('../controllers/category/updateCategory')
const deleteCategory = require('../controllers/category/deleteCategory')

const addGood = require('../controllers/goods/addGood')
const editGood = require('../controllers/goods/editGood')
const deleteGood = require('../controllers/goods/deleteGood')

const getAllGoods = require('../controllers/goods/getAllGoods');

app.post("/categories/*", createCategory.handleCreateCategory);
app.put("/categories/*", updateCategory.handleUpdateCategory);
app.delete("/categories/*", deleteCategory.handleDeleteCategory)


app.get('^/addGood$|/index(.html)?', (req, res) =>{
    res.sendFile(path.resolve("views/addGood.html"))
});
app.post('/addGood', addGood.handleAddGood)


app.get('^/editGood$|/index(.html)?', (req, res) =>{
    res.sendFile(path.resolve("views/editGood.html"))
});
app.put('/editGood', editGood.handleEditGood)


app.delete('/deleteGood', deleteGood.handleDeleteGood)


app.get('^/showItem$|/index(.html)?', (req, res) =>{
    res.sendFile(path.resolve("views/showItem.html"))
});
app.post('/*', getAllGoods.handleGetFilteredGoods);

let testCategory1
let testCategory2

it('POST method for createCategory should return status 201 and insertion request data in insert object and new category RowKey, we repeat it a second time for DELETE method test', (done) => {
    let body = {categoryParent: "rootCategory", categoryVisibleName: "test123"}
    request(app)
        .post('/categories/')
        .send(body)
        .end((err, res) => {
            testCategory1 = res.body.newCategoryRowKey
            expect(res.status).to.equal(201);
            expect(res.body.result).to.be.an('object')
        });
    request(app)
        .post('/categories/')
        .send(body)
        .end((err, res) => {
            testCategory2 = res.body.newCategoryRowKey
            expect(res.status).to.equal(201);
            expect(res.body.result).to.be.an('object')
            done();
        });
});

it('PUT method for updateCategory should return status 201, update request data and feedback about problems while removing childern', (done) => {
    let body = {categoryName: testCategory1, childrenAdd: ["child1", "child2"]}
    request(app)
        .put('/categories/')
        .send(body)
        .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body.result).to.be.an('object')
            expect(JSON.parse(res.body.feedback)).to.be.an('array')
            done();
        });
});

it('DELETE method for deleteCategory should return status 201, that it was deleted with cascade and delete request data', (done) => {
    let body = {categoryName: testCategory1, cascade: "true"}
    request(app)
        .delete('/categories/')
        .send(body)
        .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body.output).to.be.equal(`Category ${body.categoryName} deleted with cascade`)
            expect(res.body.result).to.be.an('object')
            done();
        });
});

it('DELETE method for deleteCategory should return status 201, that it was deleted and delete request data', (done) => {
    let body = {categoryName: testCategory2, cascade: "false"}
    request(app)
        .delete('/categories/')
        .send(body)
        .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body.output).to.be.equal(`Category ${body.categoryName} deleted`)
            expect(res.body.result).to.be.an('object')
            done();
        });
});

let testGood
let testGood1
it('POST method for addGood should return status 201 and insertion request data in insert object and new good RowKey', (done) => {
    let imageBase64 = fs.readFileSync("test/resources/1.png", {encoding: 'base64'})
    imageBase64 = ',' + imageBase64
    let body = {categoryName: "rootCategory", goodVisibleName: "test123", price: "1", imageBase64: imageBase64, fileRes: "png"}
    request(app)
        .post('/addGood')
        .send(body)
        .end((err, res) => {
            testGood = res.body.newGoodRowKey
            expect(res.status).to.equal(201);
            expect(res.body.result).to.be.an('object')
    });
    request(app)
        .post('/addGood')
        .send(body)
        .end((err, res) => {
            testGood1 = res.body.newGoodRowKey
            expect(res.status).to.equal(201);
            expect(res.body.result).to.be.an('object')
            done();
    });
});
it('PUT method for editGood should return status 201, update request data and queue message send result', (done) => {
    let imageBase64 = fs.readFileSync("test/resources/2.png", {encoding: 'base64'})
    imageBase64 = ',' + imageBase64
    let body = {goodName: testGood, categoryName: "rootCategory123", goodVisibleName: "test123123", price: "99999", imageBase64: imageBase64, fileRes: "png"}
    request(app)
        .put('/editGood')
        .send(body)
        .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body.result).to.be.an('object')
            expect(res.body.queueSendMessageResult).to.be.an('object')
            done();
        });
});
it('DELETE method for deleteGood should return status 201, that good and its blobs were deleted, delete request data and blob deletion operations request data', (done) => {
    
    let body = {goodName: testGood, deleteBlob: "true"}
    request(app)
        .delete('/deleteGood')
        .send(body)
        .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body.output).to.be.equal(`Deleted good ${testGood} and its blobs`)
            expect(res.body.result).to.be.an('object')
            expect(JSON.parse(res.body.blobDeletionResult)).to.be.an('array')
            done();
        });
});
it('DELETE method for deleteGood should return status 201, that good was deleted and delete request data', (done) => {
    
    let body = {goodName: testGood1, deleteBlob: "false"}
    request(app)
        .delete('/deleteGood')
        .send(body)
        .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body.output).to.be.equal(`Deleted good ${testGood1}`)
            expect(res.body.result).to.be.an('object')
            done();
        });
});

it('POST method for getAllGoods should return status 201, filtered goods and valid category tree', (done) => {
    let body = {filter: "ComputersChildChild1_1"}
    request(app)
        .post('/')
        .send(body)
        .end((err, res) => {
            expect(res.status).to.equal(201);
            expect(res.body.data).to.be.an('array')
            expect(res.body.categoryTree).to.be.an('string')
            expect(res.body.categoryTree).to.not.be.equal('Bad request')
            done();
        });
});

it('Render addGood from adminpanel', (done) => {
    request(app)
        .get('/addGood')
        .end((err, res) => {
            expect(res.status).equal(200)
            done();
        });
});

it('Render editGood from adminpanel', (done) => {
    request(app)
        .get('/editGood')
        .end((err, res) => {
            expect(res.status).equal(200)
            done();
        });
});

it('Render showItem from goods', (done) => {
    request(app)
        .get('/editGood')
        .end((err, res) => {
            expect(res.status).equal(200)
            done();
        });
});
