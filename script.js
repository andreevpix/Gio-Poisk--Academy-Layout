const searchForm = document.querySelector("#search-form");
const movie = document.querySelector("#movies");

function apiSearch(event) {

    event.preventDefault();

    const searchText = document.querySelector('.form-control').value;

    const server = ['https://api.themoviedb.org/3/search/multi?api_key=e375693d0f39fe0d00e4f47e6712492e&language=ru-RU&query=' + searchText, 'http://api.themoviedb.org/3/genre/movie/list?api_key=e375693d0f39fe0d00e4f47e6712492e'];

    requestApi('GET', server);

}

function requestApi(method, url) {
    
    //Получение информации о фильме|сериале
    const request = new XMLHttpRequest();
    request.open(method, url[0]);
    request.send();

    //Получение информации о жанре
    // const requestGenre = new XMLHttpRequest();
    // requestGenre.open(method, url[1]);
    // requestGenre.send();

    //Действие после прожатия Enter
    //Отдает информацию о фильме|сериале
    request.addEventListener('readystatechange', () => {
        //Проверка статусов
        if (request.readyState !== 4) return;
        if (request.status !== 200) {
            console.log('Error' + request.status);
            return;
        }

        //Фильтрация JSON фильма|сериала
        const output = JSON.parse(request.responseText);
        
        //Фильтрация JSON жанра фильма|сериала
        // const outputGenre = JSON.parse(requestGenre.responseText);
        
        let inner = '';
        
        //Конечный вывод результата
        output.results.forEach(function (item) {

            //Название фильма|сериала
            let nameItem = item.name || item.title;

            //Дата выхода фильма|сериала
            let releaseDate = '';

            //Жанр фильма|сериала
            //let rubric = '';

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
        })

        //вывод в HTML
        movie.innerHTML = inner;

    });

}

searchForm.addEventListener('submit', apiSearch);
