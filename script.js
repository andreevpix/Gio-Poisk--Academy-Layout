const searchForm = document.querySelector("#search-form");
const movie = document.querySelector("#movies");
const urlPoster = 'https://image.tmdb.org/t/p/w500';
const urlPosterNotFind = './img/not_loaded.jpg';

function apiSearch(event) {

    event.preventDefault();

    const searchText = document.querySelector('.form-control').value;

    const server = ['https://api.themoviedb.org/3/search/multi?api_key=e375693d0f39fe0d00e4f47e6712492e&language=ru-RU&query=' + searchText, 'http://api.themoviedb.org/3/genre/movie/list?api_key=e375693d0f39fe0d00e4f47e6712492e'];

    //Вывод строки 'Загрузка' после нажатия Enter
    movie.innerHTML = 'Загрузка...';

    fetch(server[0])
        .then((value) => {
            if (value.status !== 200) {
                return Promise.reject(new Error(value.status));
            }
            return value.json();
        })
        .then((output) => {
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

                //Формирование ссылки изображения
                if (!item.poster_path) {
                    var poster = urlPosterNotFind;
                } else {
                    poster = urlPoster + item.poster_path;
                };
                
                inner += `
                    <section class="col-5 item--film">
                        <img src="${poster}" alt="${nameItem}" />
                            <section class="item--film--info">
                                <p>${nameItem}</p>
                                <br>
                                <p>${releaseDate}</p>
                            </section>
                    </section>
                `;
            });

            //вывод в HTML
            movie.innerHTML = inner;
        })
        .catch((reason) => {
            movie.innerHTML = 'Что-то пошло не так';
            console.error('error ' + reason);
        });
};

searchForm.addEventListener('submit', apiSearch);
