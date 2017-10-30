//Підключаємо бібліотеки
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
//Підключаємо файл з доступами
var dotenv = require('dotenv').config({
    silent: process.env.NODE_ENV === 'production',
    path: __dirname + '/.env'
});

const knex = require('./db/knex.js');
const port = process.env.PORT || 8000;

//Клієнтська частина сайту знаходитиметься у папці public
app.use(express.static(__dirname + '/public'));
//Стандарти кодування
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
//Отримати юзерів
app.get('/AdministrationUsers', function (req, res) {
    knex.select().from('AdministrationUsers')
        .then(function (AdministrationUsers) {
            res.status(200).send(AdministrationUsers)
        })
});
//Отримати вчителів
app.get('/teachers', function (req, res) {
    knex.select().from('teachers')
        .then(function (teachers) {
            res.status(200).send(teachers)
        })
});

//Додати вчителя
app.post('/add-teach', function (req, res) {
    knex('teachers').insert({
        name: req.body.name,
        sname: req.body.sname
    }).then(function () {
        res.sendStatus(200);
    })
});

//Редагувати вчителя
app.post('/edit-teach', function (req, res) {
    knex('teachers').where('id', req.body.id).update({
        name: req.body.name,
        sname: req.body.sname
    }).then(function () {
        res.sendStatus(200);
    })
});

//Редагувати вчителя
app.post('/find-teach', function (req, res) {
    knex('pupils').where('name', req.body.name)
    .then(function () {
        res.sendStatus(200);
    })
});


//Видалити вчителя
app.post('/del-teach', function (req, res) {
    knex('teachers').where('id', req.body.id).del()
        .then(function () {
            res.sendStatus(200);
        })
});

//Отримати класи
app.get('/classroom', function (req, res) {
    knex.select('classroom.id as id' ,'classroom.name as class','teachers.name as name','teachers.sname as sname').from('classroom').innerJoin('teachers', 'classroom.teachers_id', 'teachers.id')
     .then(function (classroom) {
            res.status(200).send(classroom)
        })
});

//Додати клас
app.post('/add-class', function (req, res) {
    knex('classroom').insert({
        name: req.body.name,
        teachers_id: req.body.t_id
    }).then(function () {
        res.sendStatus(200);
    })
});


//Редагувати клас
app.post('/edit-class', function (req, res) {
    knex('classroom').where('id', req.body.id).update({
        name: req.body.class,
        teachers_id: req.body.ct_index
    }).then(function () {
        res.sendStatus(200);
    })
});

//Видалити клас
app.post('/del-class', function (req, res) {
    knex('classroom').where('id', req.body.id).del()
        .then(function () {
            res.sendStatus(200);
        })
});

//Додати стовпчик
app.post('/add-column', function (req, res) {
  knex.raw('ALTER TABLE `sqlkn15_3_ppr`.`teachers` ADD COLUMN '+req.body.name+' VARCHAR(45) NOT NULL AFTER `sname`;')
        .then(function () {
            console.log('good!');
            res.sendStatus(200);
        })
});


//Отримати учнів
app.post('/pupils', function (req, res) {
    knex.select().from('pupils').where('classroom_id', req.body.id)
     .then(function (pupils) {
            res.status(200).send(pupils)
        })
});
//Додати учнів
app.post('/add-pupil', function (req, res) {
    knex('pupils').insert({
        name: req.body.name,
        sname: req.body.sname
    }).then(function () {
        res.sendStatus(200);
    })
});
////Приклад чистого SQL - синтаксису на knex
//app.get('/test01', function (req, res) {
//    knex.raw('DROP DATABASE IF EXISTS testtoday')
//        .then(function () {
//            console.log('good!');
//            res.sendStatus(200);
//        })
//});

//Усі інші адреси адресують на index.html
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

//Запуск серверу
app.listen(port, function (err) {
    if (err) throw err;
    console.log('Server start on port 8000!');
});
