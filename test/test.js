const chai = require('chai');
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const expect = chai.expect;

app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const notes = [{
    noteId: 1,
    noteContent: "Hey guys, add your important notes here."
}];

const createCategory = require('../controllers/category/createCategory');
const updateCategory = require('../controllers/category/updateCategory')
const deleteCategory = require('../controllers/category/deleteCategory')

app.post("/categories/*", createCategory.handleCreateCategory);

// app.put("http://localhost:3500/categories/*", updateCategory.handleUpdateCategory);

// app.delete("http://localhost:3500/categories/*", deleteCategory.handleDeleteCategory)


app.get("/", (req, res) => {
    res.render("home", {
        data: notes
    });
});

    it('POST method for createCategory should return status 201', (done) => {
        let body = {categoryParent: "rootCategory", categoryVisibleName: "test123"}
        let data = JSON.stringify(body)
        request(app)
            .post('/categories/')
            .send({
                headers: {
                    'Content-Type': 'application/json'
                },
                body: data
            })
            .end((err, res) => {
                expect(res.status).to.equal(200);
                done();
            });
    });