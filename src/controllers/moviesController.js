const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const { validationResult } = require("express-validator")


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: async function(req,res){
        try {
            const allGenres = await Genres.findAll()
            res.render("moviesAdd", {allGenres : allGenres})
        } catch (error) {
            console.log(error);
        }
    },

    create: async function (req,res) {
        try {
            const resultvalidations = validationResult(req);

            if(!resultvalidations.isEmpty())
            {
                const allGenres = await Genres.findAll()
                return res.render('moviesAdd',{
                allGenres: allGenres,
                errors: resultvalidations.mapped(),
                oldData: req.body,
            })}

            Movies.create({
                include: [{associations : "genre"}, {associations : "movies"}],
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            })
            res.redirect('/movies')
        } catch (error) {
            console.log(error);
        }
    },
    edit: async function(req, res) {
        try {
            const allGenres = await Genres.findAll()
            const id = req.params.id;
            const Movie = await Movies.findByPk(id, {
                include : ["genre"]
            })
            res.render("moviesEdit", {
                Movie : Movie, 
                allGenres: allGenres
            })
        } catch (error) {
            console.log(error);
        }
    },
    update: async function (req,res) {
        try {
            const resultvalidations = validationResult(req);
            const id = req.params.id;
            const allGenres = await Genres.findAll()
            const Movie = await Movies.findByPk(id, {
                include : ["genre"]
            })
            if(!resultvalidations.isEmpty())
            {
                return res.render('moviesEdit',{
                errors: resultvalidations.mapped(),
                oldData: req.body,
                Movie : Movie,
                allGenres : allGenres
            })}

            Movies.update({
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            },{
                where: {id: id}
            })
            res.redirect('/movies/')
        } catch (error) {
            console.log(error);
        }
    },
    delete: async function (req,res) {
        try{
            id = req.params.id;
            const Movie = await Movies.findByPk(id, {
            include : ["genre"]
        })
        res.render('moviesDelete', {Movie : Movie});
        }catch (error) {
            console.log(error);
        }
    },
    destroy: function (req,res) {
        try {
            id = req.params.id;
            Movies.destroy({
                where: {
                    id: id
                }
            })
            res.redirect('/movies')
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = moviesController;