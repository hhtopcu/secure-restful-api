process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var bcrypt = require('bcrypt');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

var User = require('../app/models/user');

/* describe() is used for grouping tests in a logical manner. */
describe('Test Auth', function() {


    this.timeout(10000);

    User.collection.drop();

    beforeEach(function(done){
        done();
    });
    afterEach(function(done){
        User.collection.drop();
        done();
    });



    it('should give an user already exist error /register', function(done) {

        var user = new User();
        var password = "12345.";
        user.username = "trial@gmail.com";
        user.role = "admin";


        bcrypt.hash(password, 10, function (err, hash) {
            user.password = hash;

            // First create the user
            user.save(function(err,user) {

                if(err) { return(next(err)); }


                // Again try to register the current user. should give conflict
                chai.request(server)
                    .post('/register')
                    .send({'username': user.username, 'password': password})
                    .end(function(err, res){
                        // Conflict - User already exist
                        res.should.have.status(409);

                        done();
                    });
            });
        });

    });


    it('should give an user/password empty error /register', function(done) {

        chai.request(server)
            .post('/register')
            .send({'username': '', 'password': ''})
            .end(function(err, res){
                // Conflict - User already exist
                res.should.have.status(401);

                done();
            });
    });



    it('should give an user/password empty error /login', function(done) {

        chai.request(server)
            .post('/login')
            .send({'username': '', 'password': ''})
            .end(function(err, res){
                // Conflict - User already exist
                res.should.have.status(401);

                done();
            });
    });



    it('should give an invalid cridentials error /login', function(done) {

        chai.request(server)
            .post('/login')
            .send({'username': 'nosuchuser@nosuchuser.com', 'password': 'nosuchuser'})
            .end(function(err, res){
                // Conflict - User already exist
                res.should.have.status(401);

                done();
            });
    });


    it('should send token on valid login', function(done) {

        var user = new User();
        var password = "12345.";
        user.username = "trial@gmail.com";
        user.role = "admin";


        bcrypt.hash(password, 10, function (err, hash) {
            user.password = hash;
            user.save(function(err,user) {

                if(err) { return(next(err)); }


                chai.request(server)
                    .post('/login')
                    .send({'username': user.username, 'password': password})
                    .end(function(err, res){
                        // Conflict - User already exist
                        res.should.have.status(200);

                        res.body.should.be.a('object');
                        res.body.should.have.property('token');
                        res.body.should.have.property('expires');
                        res.body.should.have.property('username');

                        res.body.username.should.equal(user.username);

                        done();
                    });
            });
        });




    });


});
