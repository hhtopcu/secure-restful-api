/**
 * Created by hhtopcu on 16/12/15.
 */
var mongoose        = require('mongoose');
var User = require('../models/user');

var routers = {

    /* Get single instance of booking */
    getOne: function(req, res) {

        var id = mongoose.Types.ObjectId(req.params.id);

        User.findOne({'business._id': id})
            .select('business')
            .exec(function (err, data) {

                if (err || !data) {
                    res.status(404).send();
                    return;
                }

                res.status(200).json(data.business);

            });
    },


    /* Update an existing booking */
    update: function(req, res, next) {

        var id = mongoose.Types.ObjectId(req.params.id);

        var business = req.body.business || '';

        User.update({ 'business._id': id},
            { $set: {
                'business.storeName': business.storeName,
                'business.bio': business.bio,
                'business.photoUrl': business.photoUrl,
                'business.photoMd5': business.photoMd5,
                'business.phone': business.phone,
                'business.email': business.email,
                'business.storeName': business.storeName,
            }}, function(err){

                if (err) {
                    console.log(err);
                    res.status(409).send();
                    return;
                }

                res.status(201).json({ message: 'Business Info is updated!' });
            });
    },

};


module.exports = routers;
