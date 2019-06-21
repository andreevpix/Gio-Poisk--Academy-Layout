const searchForm = document.querySelector("#search-form");
const movie = document.querySelector("#movies");
const urlPoster = 'https://image.tmdb.org/t/p/w500';
const urlPosterNotFind = './img/not_loaded.jpg';

function apiSearch(event) {

    event.preventDefault();

    const searchText = document.querySelector('.form-control').value;
    
    if (searchText.trim().length === 0) {
        movie.innerHTML =`
        <h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым</h2>
        `;
        return;
    }

    //Вывод строки 'Загрузка' после нажатия Enter
    movie.innerHTML = '<div class="spinner"></div>';

    fetch('https://api.themoviedb.org/3/search/multi?api_key=e375693d0f39fe0d00e4f47e6712492e&language=ru-RU&query=' + searchText)
        .then((value) => {
            if (value.status !== 200) {
                return Promise.reject(new Error(value.status));
            }
            return value.json();
        })
        .then((output) => {
            let inner = '';
            if (output.results.length === 0) {
                inner = '<h2 class="col-12 text-center text-info">По вашему запросу ничго не найдено.</h2>';
            }
            //Конечный вывод результата
            output.results.forEach(function (item) {
                //Название фильма|сериала
                let nameItem = item.name || item.title;
                let dataInfo = '';
                //Заглушка/оригинал картинки фильма|сериала
                let poster = '';
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
                item.poster_path ? poster = urlPoster + item.poster_path : poster = urlPosterNotFind;

                if (item.media_type !== 'person') {
                    dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`
                }

                inner += `
                    <section class="col-12 col-md-6 col-xl-3 item--film">
                        <img src="${poster}" class="img_poster" alt="${nameItem}" ${dataInfo} />
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

            addEventMedia();
            
        })
        .catch((reason) => {
            movie.innerHTML = 'Что-то пошло не так';
            console.error(reason || reason.status);
        });
};

//При нажатии на картинку|постер, вызываем функцию showFullInfo
function addEventMedia () {
    const media = movie.querySelectorAll('.item--film>img[data-id]');
        media.forEach(function (elem) {
            elem.style.cursor = 'pointer';
            elem.addEventListener('click', showFullInfo);
        })
}

function showFullInfo() {
    let url = '';
    if (this.dataset.type === 'movie') {
        url = 'https://api.themoviedb.org/3/movie/' + this.dataset.id + '?api_key=e375693d0f39fe0d00e4f47e6712492e&language=ru';
    } else if (this.dataset.type === 'tv') {
        url = 'https://api.themoviedb.org/3/tv/' + this.dataset.id + '?api_key=e375693d0f39fe0d00e4f47e6712492e&language=ru';
    } else {
        movie.innerHTML = '<h2 class="col-12 text-center text-info">Ошибка. Повторите позже.</h2>';
    }

    fetch(url)
        .then((value) => {
            if (value.status !== 200) {
                return Promise.reject(new Error(value.status));
            }
            return value.json();
        })
        .then((output) => {

            movie.innerHTML = `
            <h4 class="col-12 text-center text-info">${output.name || output.title}</h4>
            <section class="col-4">
            
            <img src="${urlPoster + output.poster_path}" alt="${output.name || output.title}" />
            ${(output.homepage ? `<p class="text-center"><a href="${output.homepage}" target="_blank">Официальная страница</a></p>` : '')}
            ${(output.homepage ? `<p class="text-center"><a href="https://imdb.com/title/${output.imdb_id}" target="_blank">Страница на IMDB.Com</a></p>` : '')}
            </section>
            <section class="col-8">
                <p>Рейтинг: ${output.vote_average}</p>
                <p>Статус: ${output.status}</p>
                <p>Премьера: ${output.first_air_date || output.releaseDate}</p>

                ${(output.last_episode_to_air) ? `<p>${output.number_of_seasons} сезонов ${output.last_episode_to_air.episode_number} серий вышло</p>` : ''}

                <p>Описание: ${output.overview}</p>
            </section>
            `;
            
        })
        .catch((reason) => {
            movie.innerHTML = 'Что-то пошло не так';
            console.error(reason || reason.status);
        });
};

//Тренды на главной странице
document.addEventListener('DOMContentLoaded', () => {
    fetch('https://api.themoviedb.org/3/trending/all/week?api_key=e375693d0f39fe0d00e4f47e6712492e&language=ru')
        .then((value) => {
            if (value.status !== 200) {
                return Promise.reject(new Error(value.status));
            }
            return value.json();
        })
        .then((output) => {
            let inner = '<h4 class="col-12 text-center text-info">Популярные за неделю</h2>';
            if (output.results.length === 0) {
                inner = '<h2 class="col-12 text-center text-info">По вашему запросу ничго не найдено.</h2>';
            }
            //Конечный вывод результата
            output.results.forEach(function (item) {
                let mediaType = item.title ? 'movie' : 'tv';
                let dataInfo = `data-id="${item.id}" data-type="${mediaType}"`;
                //Название фильма|сериала
                let nameItem = item.name || item.title;
                //Заглушка/оригинал картинки фильма|сериала
                let poster = '';
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
                item.poster_path ? poster = urlPoster + item.poster_path : poster = urlPosterNotFind;
                

                inner += `
                    <section class="col-12 col-md-6 col-xl-3 item--film">
                        <img src="${poster}" class="img_poster" alt="${nameItem}" ${dataInfo} />
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

            addEventMedia();
            
        })
        .catch((reason) => {
            movie.innerHTML = 'Что-то пошло не так';
            console.error('error ' + reason);
        });
});

searchForm.addEventListener('submit', apiSearch);