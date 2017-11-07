const app = angular.module('app', ['ngRoute', 'ngDialog']);
//Забираєм %2F та # з url сайту
app.config(['$locationProvider', function ($locationProvider) {
    $locationProvider.hashPrefix('');
    $locationProvider.html5Mode(true);
}]);
//Створюєм адреси
app.config(function ($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/'
    });
});
//Контроллер
app.controller("MyCtrl", function () {});
//Директива Меню
app.directive('naviBlock', function () {
    return {
        replace: true
        , templateUrl: 'template/navi-menu.html'
        , controller: function ($scope, $http, ngDialog) {
            //Сторінки
            $scope.teachersStatus = false;
            $scope.classroomStatus = false;
            $scope.pupilsStatus = false;
            $scope.loginStatus = false;
            $scope.authorizationStatus = true;
            $scope.loginedUser = false;
            $scope.adminOnly = false;
            $scope.moderateOnly = false;
            //Показати вчителів
            $scope.teachersStart = function () {
                    $scope.teachersStatus = true;
                    $scope.classroomStatus = false;
                    $scope.pupilsStatus = false;
                }
                //Приховати вчителів
            $scope.closeTeachers = function () {
                    $scope.teachersStatus = false;
                }
                //Показати класи
            $scope.classroomStart = function () {
                    $scope.classroomStatus = true;
                    $scope.teachersStatus = false;
                    $scope.pupilsStatus = false;
                }
                //Приховати класи
            $scope.closeClassroom = function () {
                $scope.classroomStatus = false;
            }
            $scope.closePupils = function () {
                    $scope.pupilsStatus = false;
                }
            //Gradients
              var granimInstance = new Granim({
            element: '#canvas-basic'
            , name: 'basic-gradient'
            , direction: 'left-right'
            , opacity: [1, 1]
            , isPausedWhenNotInView: true
            , states: {
                "default-state": {
                    gradients: [
                ['#45145A', '#FF5300']
              , ['#ED1C24', '#FBB03B']

            ]
                }
            }
        });
                //Отримати юзерів
            $http.get('http://localhost:8000/AdministrationUsers').then(function successCallback(response) {
                $scope.AdmUsers = response.data;
                console.log($scope.AdmUsers);
            }, function errorCallback(response) {
                console.log("Error!!!" + response.err);
            });
            $scope.authorization = function () {
                logined.innerHTML = 'Ви увійшли як ' + "<span id='logInfo'>" + $scope.login + '</span>';
                for (let i = 0; i < $scope.AdmUsers.length; i++) {
                    if ($scope.login == $scope.AdmUsers[i].login && $scope.pass == $scope.AdmUsers[i].password && $scope.AdmUsers[i].role == 'admin') {
                        $scope.loginStatus = true;
                        $scope.authorizationStatus = false;
                        $scope.loginedUser = true;
                        $scope.adminOnly = true;
                        $scope.moderateOnly = true;
                        break;
                    }
                    else if ($scope.login == $scope.AdmUsers[i].login && $scope.pass == $scope.AdmUsers[i].password && $scope.AdmUsers[i].role == 'moderator') {
                        $scope.loginStatus = true;
                        $scope.authorizationStatus = false;
                        $scope.loginedUser = true;
                        $scope.moderateOnly = true;
                        break;
                    }
                    else if ($scope.login == $scope.AdmUsers[i].login && $scope.pass == $scope.AdmUsers[i].password && $scope.AdmUsers[i].role == 'user') {
                        $scope.loginStatus = true;
                        $scope.authorizationStatus = false;
                        $scope.loginedUser = true;
                        break;
                    }
                    else if (i == $scope.AdmUsers.length - 1) {
                        alert('Невірний логін чи пароль!');
                    }
                }
            };
            $scope.logOut = function () {
                $scope.login = '';
                $scope.pass = '';
                $scope.loginStatus = false;
                $scope.authorizationStatus = true;
                $scope.loginedUser = false;
                $scope.adminOnly = false;
                $scope.teachersStatus = false;
                $scope.classroomStatus = false;
                $scope.pupilsStatus = false;
                $scope.moderateOnly = false;
            }
        }
    }
});
//Директива Вчителі
app.directive('teachersBlock', function () {
    return {
        replace: true
        , templateUrl: 'template/teachers-dir.html'
        , controller: function ($scope, $http, ngDialog) {
            //Отримати список вчителів
            $http.get('http://localhost:8000/teachers').then(function successCallback(response) {
                $scope.teachers = response.data;
            }, function errorCallback(response) {
                console.log("Error!!!" + response.err);
            });
            //Додати вчителя
            $scope.addTeachers = function () {
                //Відкриваєм модальне вікно з формою для додавання вчителя
                ngDialog.open({
                        template: '/template/addTeachers.html'
                        , scope: $scope
                        , controller: function ($scope) {
                            $scope.addTeachersStatus = true;
                            $scope.nameTeacher = "";
                            $scope.snameTeacher = "";
                            //Відправляєм дані нового вчителя на сервер
                            $scope.addteach = function () {
                                let teacherObj = {
                                    name: $scope.nameTeacher
                                    , sname: $scope.snameTeacher
                                };
                                $http.post('http://localhost:8000/add-teach', teacherObj).then(function successCallback(response) {
                                    $scope.addTeachersStatus = false;
                                    ngDialog.closeAll();
                                    $scope.nameTeacher = "";
                                    $scope.snameTeacher = "";
                                }, function errorCallback(response) {
                                    console.log("Error!!!" + response.err);
                                });
                            };
                        }
                        , className: 'ngdialog-theme-default'
                    })
                    //Оновлюєм список вчителів після закриття модального вікна
                    .closePromise.then(function (res) {
                        $http.get('http://localhost:8000/teachers').then(function successCallback(response) {
                            $scope.teachers = response.data;
                        }, function errorCallback(response) {
                            console.log("Error!!!" + response.err);
                        });
                    });
            };
            //Редагуємо дані вчителя
            //Вікриваєм модальне вікно для редагування
            $scope.editTeacher = function (index, name, sname) {
                ngDialog.open({
                    template: '/template/editTeachers.html'
                    , scope: $scope
                    , controller: function ($scope) {
                        $scope.editTeachStatus = true;
                        $scope.editNameTeacher = name;
                        $scope.editSnameTeacher = sname;
                        $scope.indexOfTeacher = index;
                        //Надсилаєм відредаговані дані вчителя на сервер
                        $scope.editTeach = function () {
                            let teacherObj = {
                                id: $scope.indexOfTeacher
                                , name: $scope.editNameTeacher
                                , sname: $scope.editSnameTeacher
                            };
                            $http.post('http://localhost:8000/edit-teach', teacherObj).then(function successCallback(response) {
                                ngDialog.closeAll();
                            }, function errorCallback(response) {
                                console.log("Error!!!" + response.err);
                            });
                        }
                    }
                }).closePromise.then(function (res) {
                    //Оновлюєм список вчителів після закриття модального вікна
                    $http.get('http://localhost:8000/teachers').then(function successCallback(response) {
                        $scope.teachers = response.data;
                        //Оновлюємо класи після закриття модального вікна
                        $http.get('http://localhost:8000/classroom').then(function successCallback(response) {
                            $scope.classroom = response.data;
                        }, function errorCallback(response) {
                            console.log("Error!!!" + response.err);
                        });
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
                });
            };
            //Додати стовпчик
            $scope.addColumnTeachers = function () {
                ngDialog.open({
                    template: '/template/addColumnTeacher.html'
                    , scope: $scope
                    , controller: function ($scope) {
                        $scope.addColumn = function () {
                            let columnObj = {
                                name: $scope.addNameColumn
                            };
                            $http.post('http://localhost:8000/add-column', columnObj).then(function successCallback(response) {
                                ngDialog.closeAll();
                            }, function errorCallback(response) {
                                console.log("Error!!!" + response.err);
                            });
                        }
                    }
                }).closePromise.then(function (res) {
                    $http.get('http://localhost:8000/teachers').then(function successCallback(response) {
                        $scope.teachers = response.data;
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
                });
            };
            //Видалити вчителя
            $scope.deleteTeacher = function (index) {
                //Підтвердження видалення
                let teacherObj = {
                    id: index
                };
                swal({
                    title: 'Ви впевнені?'
                    , text: "Видалити вчителя?"
                    , type: 'warning'
                    , showCancelButton: true
                    , confirmButtonColor: '#3085d6'
                    , cancelButtonColor: '#d33'
                    , confirmButtonText: 'Yes, delete it!'
                }).then(function () {
                    swal('Видалено!', 'Вчителя видалено із списку.', 'success');
                    //Надсилаєм дані на видалення вчителя
                    $http.post('http://localhost:8000/del-teach', teacherObj).then(function successCallback(response) {
                        //Повторно генеруєм список вчителів
                        $http.get('http://localhost:8000/teachers').then(function successCallback(response) {
                            $scope.teachers = response.data;
                            //Повторно генеруєм список класів
                            $http.get('http://localhost:8000/classroom').then(function successCallback(response) {
                                $scope.classroom = response.data;
                            }, function errorCallback(response) {
                                console.log("Error!!!" + response.err);
                            });
                        }, function errorCallback(response) {
                            console.log("Error!!!" + response.err);
                        });
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
                })
            }
        }
    }
});
//Директива Класи
app.directive('classroomBlock', function () {
    return {
        replace: true
        , templateUrl: 'template/classroom.html'
        , controller: function ($scope, $http, ngDialog) {
            //Загрузити класи
            $http.get('http://localhost:8000/classroom').then(function successCallback(response) {
                $scope.classroom = response.data;
            }, function errorCallback(response) {
                console.log("Error!!!" + response.err);
            });
            //Додати клас
            $scope.addNewClassroom = function () {
                    //Відкриваєм модальне вікно
                    ngDialog.open({
                        template: '/template/addclass.html'
                        , scope: $scope
                        , controller: function ($scope) {
                            $scope.addClasses = function () {
                                var sel2 = document.getElementById("teachersSelect");
                                var val = sel2.options[sel2.selectedIndex].value;
                                let classObj = {
                                    name: $scope.addNameClass
                                    , t_id: val
                                };
                                //Редагуємо клас
                                $http.post('http://localhost:8000/add-class', classObj).then(function successCallback(response) {
                                    ngDialog.closeAll();
                                }, function errorCallback(response) {
                                    console.log("Error!!!" + response.err);
                                });
                            }
                        }
                    }).closePromise.then(function (res) {
                        //Повторно отримуєм класи
                        $http.get('http://localhost:8000/classroom').then(function successCallback(response) {
                            $scope.classroom = response.data;
                        }, function errorCallback(response) {
                            console.log("Error!!!" + response.err);
                        });
                    });
                }
                //Редагувати клас
            $scope.editClassroom = function (index, className, name, sname, t_index) {
                $scope.editedClassIndex = index;
                $scope.editNameClass = className;
                $scope.editedClassTeacherName = name;
                $scope.editedClassTeacherSname = sname;
                $scope.editedClassTeacherIndex = t_index;
                //Відкриваєм модальне вікно
                ngDialog.open({
                    template: '/template/editclass.html'
                    , scope: $scope
                    , controller: function ($scope) {
                        //Отримуєм список класів
                        $http.get('http://localhost:8000/classroom').then(function successCallback(response) {
                            //Виставляєм в селекті вчителя даного класу
                            var sel = document.getElementById("teachersSelect");
                            var testur = "" + $scope.editedClassTeacherName + " " + $scope.editedClassTeacherSname;
                            for (i = 0; i < sel.options.length; i++) {
                                if (sel.options[i].text == testur) {
                                    sel.selectedIndex = i;
                                }
                            }
                        }, function errorCallback(response) {
                            console.log("Error!!!" + response.err);
                        });
                        //Надсилаєм дані зміненого класу
                        $scope.editClasses = function () {
                            var sel2 = document.getElementById("teachersSelect");
                            var val = sel2.options[sel2.selectedIndex].value;
                            let classObj = {
                                id: $scope.editedClassIndex
                                , class: $scope.editNameClass
                                , ct_index: val
                            };
                            //Редагуємо клас
                            $http.post('http://localhost:8000/edit-class', classObj).then(function successCallback(response) {
                                ngDialog.closeAll();
                            }, function errorCallback(response) {
                                console.log("Error!!!" + response.err);
                            });
                        }
                    }
                }).closePromise.then(function (res) {
                    //Повторно отримуєм класи
                    $http.get('http://localhost:8000/classroom').then(function successCallback(response) {
                        $scope.classroom = response.data;
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
                });
            };
            //Перехід від списку класів до вибраного класу
            $scope.gotoClassroom = function (index, name) {
                    $scope.classPupilsName = name;
                    $scope.classroomStatus = false;
                    $scope.pupilsStatus = true;
                    let pupilsObj = {
                        id: index
                    };
                    //Загружаємо учнів
                    $http.post('http://localhost:8000/pupils', pupilsObj).then(function successCallback(response) {
                        $scope.pupils = response.data;
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
                }
                //Видаляємо клас
            $scope.deleteClassroom = function (index) {
                //Підтвердження видалення
                let classObj = {
                    id: index
                };
                swal({
                    title: 'Ви впевнені?'
                    , text: "Видалити клас?"
                    , type: 'warning'
                    , showCancelButton: true
                    , confirmButtonColor: '#3085d6'
                    , cancelButtonColor: '#d33'
                    , confirmButtonText: 'Yes, delete it!'
                }).then(function () {
                    swal('Видалено!', 'Клас видалено із списку.', 'success');
                    //Надсилаєм дані на видалення вчителя
                    $http.post('http://localhost:8000/del-class', classObj).then(function successCallback(response) {
                        //Повторно генеруєм список класів
                        $http.get('http://localhost:8000/classroom').then(function successCallback(response) {
                            $scope.classroom = response.data;
                        }, function errorCallback(response) {
                            console.log("Error!!!" + response.err);
                        });
                    }, function errorCallback(response) {
                        console.log("Error!!!" + response.err);
                    });
                })
            }
        }
    }
});
//Директива Учнів
app.directive('pupilsBlock', function () {
    return {
        replace: true
        , templateUrl: 'template/pupils.html'
        , controller: function ($scope, $http, ngDialog) {
            //Повернутись до списку класів
            $scope.gotoClassroomBack = function () {
                $scope.classroomStatus = true;
                $scope.pupilsStatus = false;
            }
            $scope.addNewPupil = function () {
                //Відкриваєм модальне вікно з формою для додавання учня
                ngDialog.open({
                        template: '/template/addpupil.html'
                        , scope: $scope
                        , controller: function ($scope) {
                            $scope.addPupilStatus = true;
                            $scope.namePupil = "";
                            $scope.snamePupil = "";
                            //Відправляєм дані нового учня на сервер
                            $scope.addPupils = function () {
                                let pupilObj = {
                                    name: $scope.namePupil
                                    , sname: $scope.snamePupil
                                };
                                $http.post('http://localhost:8000/add-pupil', pupilObj).then(function successCallback(response) {
                                    $scope.addPupilStatus = false;
                                    ngDialog.closeAll();
                                    $scope.namePupil = "";
                                    $scope.snamePupil = "";
                                }, function errorCallback(response) {
                                    console.log("Error!!!" + response.err);
                                });
                            };
                        }
                        , className: 'ngdialog-theme-default'
                    })
                    //Оновлюєм список вчителів після закриття модального вікна
                    .closePromise.then(function (res) {
                        $http.get('http://localhost:8000/pupils').then(function successCallback(response) {
                            $scope.pupils = response.data;
                        }, function errorCallback(response) {
                            console.log("Error!!!" + response.err);
                        });
                    });
            };
        }
    }
});