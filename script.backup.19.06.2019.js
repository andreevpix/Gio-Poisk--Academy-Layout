const searchForm = document.querySelector("#search-form");
const movie = document.querySelector("#movies");

function apiSearch(event) {

    event.preventDefault();

    const searchText = document.querySelector('.form-control').value;

    const server = ['https://api.themoviedb.org/3/search/multi?api_key=e375693d0f39fe0d00e4f47e6712492e&language=ru-RU&query=' + searchText, 'http://api.themoviedb.org/3/genre/movie/list?api_key=e375693d0f39fe0d00e4f47e6712492e'];

    //Вывод строки 'Загрузка' после нажатия Enter
    movie.innerHTML = 'Загрузка...';

    requestApi(server)
        .then(function (result) {

            //Фильтрация JSON фильма|сериала
            const output = JSON.parse(result);
            
            //Фильтрация JSON жанра фильма|сериала
            // const outputGenre = JSON.parse(requestGenre.responseText);
            
            let inner = '';

            //Конечный вывод результата
            output.results.forEach(function (item) {

                //Название фильма|сериала
                let nameItem = item.name || item.title;

                //Дата выхода фильма|сериала
                let releaseDate = '';

                //Формирование строки даты выхода серии|фильма
                if (!item.release_date && item.first_air_date) {
                    releaseDate = 'Дата выхода серии: ' + item.first_air_date;
                } else if (item.release_date && !item.first_air_date) {
                    releaseDate = 'Дата выхода фильма: ' + item.release_date;
                } else {
                    releaseDate = 'Дата выхода неизвестна';
                }

                inner += `
                <div class="col-5 item--film">
                <p>${nameItem}</p>
                <br>
                <p>${releaseDate}</p>
                </div>
                `;
            });

            //вывод в HTML
            movie.innerHTML = inner;
        })
        .catch(function (reaseon) {
            movie.innerHTML = 'Что-то пошло не так';
            console.log('error ' + reaseon.status);
        })
        ;

};

function requestApi(url) {

    //Получение информации о фильме|сериале
    //Promise - обещание
    return new Promise (function (resolve, reject) {

        const request = new XMLHttpRequest();
        request.open('GET', url[0]);

        //Получение информации о жанре
        // const requestGenre = new XMLHttpRequest();
        // requestGenre.open('GET', url[1]);
        // requestGenre.send();

        request.addEventListener('load', function () {
            if (request.status !== 200) {
                reject({status: request.status});
                return;
        };

        resolve(request.response);

    });

        //Описание ошибки
        request.addEventListener('error', function () {
            reject({status: request.status});
        });

        request.send();

    });
};

searchForm.addEventListener('submit', apiSearch);
