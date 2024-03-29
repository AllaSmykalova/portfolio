"use strict";

const api = "2b774cf0-b34b-40b0-b336-db05869eb571";
const server = "http://exam-2023-1-api.std-900.ist.mospolytech.ru";
let routes = [];
let fileteredroutes = [];
let guides = [];
let currentRoute;
let currentGuide;

function genURL(path) { //функция генерации ссылок
    let url = new URL(`${server}/api/${path}`);
    url.searchParams.set("api_key", api);
    return url;
};

// функция отображение гидов
function showguides(guideslist) {
    let table = document.getElementById("guidetable");
    table.innerHTML = "";

    for (let guide of guideslist) {
        let tr = document.createElement("tr");

        if (guide.id == currentGuide) {
            tr.classList.add("table-secondary");
        }

        let nametd = document.createElement("td");
        nametd.innerHTML = guide.name;
        let langtd = document.createElement("td");
        langtd.innerHTML = guide.language;
        let exptd = document.createElement("td");
        exptd.innerHTML = guide.workExperience;
        let pricetd = document.createElement("td");
        pricetd.innerHTML = guide.pricePerHour;
        let buttontd = document.createElement("td");
        let button = document.createElement("button");
        button.classList.add("btn", "btn-primary");
        button.innerHTML = "Выбрать";
        button.onclick = function () {
            currentGuide = guide.id;

            let rows = document.querySelectorAll("#guidetable tr");
            for (let row of rows) {
                row.classList.remove("table-secondary");
            }

            this.closest("tr").classList.add("table-secondary");

            let orderbtn = document.getElementById("orderbtn");
            orderbtn.classList.remove("hidden");
            window.location.href = "#orderbtn";
        };
        buttontd.appendChild(button);
        tr.appendChild(nametd);
        tr.appendChild(langtd);
        tr.appendChild(exptd);
        tr.appendChild(pricetd);
        tr.appendChild(buttontd);

        table.appendChild(tr);

    }
}

// функция фильтрации гидов
function filterguides() {
    let language = document.getElementById("langchange").value;

    let expF = document.getElementById("expFrom").value;
    let expT = document.getElementById("expTo").value;

    let filteredguides = [];

    for (let guide of guides) {
        if (guide.language == language || language == "Любой") {
            if (guide.workExperience <= expT && guide.workExperience >= expF) {
                filteredguides.push(guide);
            }
        }
    }

    showguides(filteredguides);
}


// функция получение гидов для маршрута
async function getguides() {
    // составляем ссылку для получения гидов по выбранному маршруту
    let url = genURL(`routes/${currentRoute}/guides`);
    let languages = [];

    let res = await fetch(url);

    if (res.status == 200) {
        guides = await res.json(); //заполняем языки
        for (let guide of guides) {
            if (!languages.includes(guide.language)) {
                languages.push(guide.language);
            }
        }

        let langselector = document.getElementById("langchange");
        langselector.innerHTML = "";
        let option = document.createElement("option");
        option.innerHTML = "Любой";
        langselector.appendChild(option);

        for (let language of languages) {
            let option = document.createElement("option");
            option.innerHTML = language;
            langselector.appendChild(option);
        }

        filterguides();
    }

};

function showroutes(page) {//маршруты
    let table = document.getElementById("routestable");
    table.innerHTML = "";
    let startPage = (page - 1) * 5;
    let endPage = Math.min(page * 5, fileteredroutes.length);
    for (let i = startPage; i < endPage; i++) {
        let row = document.createElement("tr");
        let nametd = document.createElement("td");
        nametd.innerHTML = fileteredroutes[i].name;
        let desctd = document.createElement("td");
        desctd.innerHTML = fileteredroutes[i].description;
        let mainfacilities = document.createElement("td");
        mainfacilities.innerHTML = fileteredroutes[i].mainObject;

        // Создаём кнопку для выбора маршрута
        let btn = document.createElement("button");
        btn.classList.add("btn", "btn-primary");
        btn.innerHTML = "Выбрать";
        // Создаём функцию, которая будет срабатывать при нажатии на кнопку
        btn.onclick = async function () {
            // Записываем id маршрута
            currentRoute = fileteredroutes[i].id;
            currentGuide = undefined;
            let rows = document.querySelectorAll("#routestable tr");
            for (let row of rows) {
                row.classList.remove("table-secondary");
            }

            // Выделяем строку таблицы, в которой находится кнопка
            this.closest("tr").classList.add("table-secondary");

            // Показываем раздел с выбором гида
            let guidesSection = document.getElementById("guidesSect");
            guidesSection.classList.remove("hidden");

            // прячем кнопку выбора гида
            let orderbtn = document.getElementById("orderbtn");
            orderbtn.classList.add("hidden");

            // вызываем функцию получения маршрутов
            getguides();

            // Проскальзываем до таблицы гидов
            window.location.href = "#guidesSect";
        };

        // Создаём ячейку с кнопкой в маршруты
        let btntd = document.createElement("td");
        btntd.appendChild(btn);

        row.appendChild(nametd);//добавили ячейку в строку
        row.appendChild(desctd);
        row.appendChild(mainfacilities);
        row.appendChild(btntd);

        if (routes[i].id == currentRoute) {
            row.classList.add("table-secondary");
        }

        table.appendChild(row);//добавили строку в таблицу
    }
};


// Функция для отображения пагинации
function showpagebtns(page) {
    // Общее количество страниц
    let pagesCount = Math.ceil(fileteredroutes.length / 5);
    let pagemenu = document.querySelector(".pagination");
    // Предварительно очищаем его
    pagemenu.innerHTML = "";

    // Создаём кнопку перехода на пред страницу
    let prevPageBtn = document.createElement("li");
    // Добавляем класс для бустрапа
    prevPageBtn.classList.add("page-item");
    // Чтобы при её нажатии страница прокручивалась к началу таблицы
    prevPageBtn.setAttribute("href", "#routestable");
    // Создаём содержимое кнопки
    let prevPageLink = document.createElement("a");
    prevPageLink.classList.add("page-link");
    prevPageLink.innerHTML = "Предыдущая";
    // Добавляем содержимое в кнопку
    prevPageBtn.appendChild(prevPageLink);

    // Делаем кнопку не активной, если мы на первой странице
    if (page == 1) {
        prevPageBtn.classList.add("disabled");
    } else { // Иначе, даём ей функционал
        prevPageBtn.onclick = function () {
            showpagebtns(page - 1);
        };
    }

    // Добавляем кнопку в меню пагинации
    pagemenu.appendChild(prevPageBtn);

    // Создаём кнопку перехода на следующую страницу
    let nextPageBtn = document.createElement("li");
    // Добавляем класс для бустрапа
    nextPageBtn.classList.add("page-item");
    // Создаём содержимое кнопки
    let nextPageLink = document.createElement("a");
    nextPageLink.classList.add("page-link");
    nextPageLink.innerHTML = "Следующая";
    // Добавляем содержимое в кнопку
    nextPageBtn.appendChild(nextPageLink);

    // Делаем кнопку не активной, если мы на последней странице
    if (page == pagesCount) {
        nextPageBtn.classList.add("disabled");
    } else { // Иначе, даём ей функционал
        nextPageBtn.onclick = function () {
            showpagebtns(page + 1);
        };
    }

    // Создаём кнопки перехода к конкретной странице,определяя диапозон отоброжения
    let start = Math.max(page - 2, 1);
    let end = Math.min(page + 2, pagesCount);

    // Создаём кнопки
    for (let i = start; i <= end; i++) {
        let pageitem = document.createElement("li");
        pageitem.setAttribute("href", "#routestable");
        pageitem.classList.add("page-item");
        if (i == page) { // Помечаем кнопку выбранной страницы
            pageitem.classList.add("current");
        } else { // Иначе добавляем ей функционал
            pageitem.onclick = function () {
                showpagebtns(i);
            };
        }
        let pagelink = document.createElement("a");
        pagelink.classList.add("page-link");
        pagelink.innerHTML = i;
        pageitem.appendChild(pagelink);
        pagemenu.appendChild(pageitem);
    }

    // Добавляем кнопку перехода на следующую страницу в меню пагинации
    pagemenu.appendChild(nextPageBtn);

    // Отображаем выбранную страницу
    showroutes(page);
};

// Функция фильтрации маршрутов
function filerroutes() {
    // Очищаем список отфильтрованных маршрутов
    fileteredroutes = [];

    // По какому имени надо фильтровать маршруты
    let srcname = document.getElementById("routeName").value;
    // По какому объекту надо фильтровать маршруты
    let srcobj = document.getElementById("mainObject").value;

    // Фильтруем маршруты
    for (let route of routes) {
        // Фильтруем по имени
        if (route.name.includes(srcname)) {
            // Фильтруем по объекту
            if (srcobj == "Не выбран" || route.mainObject.includes(srcobj)) {
                fileteredroutes.push(route);
            }
        }
    }

    showpagebtns(1);
}

// Функция для получения списка всех объектов всех маршрутов
function getObjects() {
    // Список всех объектов
    let objectlist = [];
    // Поиск селектора объектов
    let objselect = document.getElementById("mainObject");
    objselect.innerHTML = "";

    // Выбираем объекты из маршрутов
    for (let route of routes) {
        // Разделяем маршруты по " - "
        // т.е. из "Объект 1 - объект 2", получим список:
        // ["Объект 1", "объект 2"]
        let objects = route.mainObject.split(" - ");
        // Проходимся по каждому из полученных объектов
        for (let object of objects) {
            // укорачиваем название объекта, если оно слишком длинное
            // чтобы селектор объектов не был слишком большим
            if (object.length > 50) {
                object = object.slice(0, 50);
            }

            // Проверяем что мы его ещё не добавили в список
            if (!objectlist.includes(object)) {
                // Добавляем
                objectlist.push(object);
            }
        }
    }

    // Делаем опцию "Не выбрано", чтобы не фильтровать по объекту
    let notSelectedOpt = document.createElement("option");
    notSelectedOpt.innerHTML = "Не выбран";
    objselect.appendChild(notSelectedOpt);

    // Создаём опции для всех объектов
    for (let object of objectlist) {
        let option = document.createElement("option");
        option.innerHTML = object;
        objselect.appendChild(option);
    }
}

// функция получения маршрутов
async function getroutes() {
    let url = genURL("routes");
    let result = await fetch(url);
    if (result.status == 200) {
        //храним маршруты в JSON await при вызывании ассинхронной функции
        let json = await result.json();
        return json;
    }
};

// Проверка, является ли день выходным
function isDayOff(date) {
    let day = new Date(date);
    if (day.getDay() == 6 || day.getDay() == 7) {
        return true;
    }
    if (date >= "2024-01-01" && date <= "2024-01-08") {
        return true;
    }
    let daysOff = ["2024-02-23", "2024-03-08", "2024-04-29", "2024-04-30",
        "2024-05-01", "2024-05-09", "2024-05-10", "2024-06-12",
        "2024-10-04", "2024-12-30", "2024-12-31"];

    if (daysOff.includes(date)) {
        return true;
    }
    return false;
}

// Функция расчёта стоимости экскурсии
function calculateprice() {
    let interguide = document.getElementById("interGuide").checked;
    let souvenirs = document.getElementById("souvenirs").checked;
    let people = document.getElementById("excPeople").value;
    let duration = document.getElementById("excDuration").value;
    let date = document.getElementById("excDate").value;
    let time = document.getElementById("excTime").value;

    let basePrice = 0; // базовая стоимость
    let priceIndex = 1; // во сколько раз надо увеличить цену
    let curguide;
    for (let guide of guides) {
        if (guide.id == currentGuide) {
            curguide = guide;
        }
    }

    // итоговая стоимость за гида
    basePrice += curguide.pricePerHour * duration;

    let curroute;
    for (let route of routes) {
        if (route.id == currentRoute) {
            curroute = route;
        }
    }

    // доп опция 1
    if (interguide) {
        priceIndex += 0.5;
    }

    // доп опция 2
    if (souvenirs) {
        basePrice += 500 * people;
    }

    // если экскурсия заказана на выходной день
    if (isDayOff(date)) {
        priceIndex += 0.5;
    }

    // если много посетителей
    if (people >= 5 && people <= 10) {
        basePrice += 1000;
    } else if (people > 10) {
        basePrice += 1500;
    }

    // если утром или вечером
    if (time >= "09:00" && time <= "12:00") {
        basePrice += 400;
    } else if (time >= "20:00" && time <= "23:00") {
        basePrice += 1000;
    }

    let priceField = document.getElementById("totalPrice");
    priceField.innerHTML = Math.round(basePrice * priceIndex);

};

// функция оформления заказа
async function order() {
    // собираем данные с формы
    let interguide = document.getElementById("interGuide").checked;
    let souvenirs = document.getElementById("souvenirs").checked;
    let price = document.getElementById("totalPrice").innerHTML;
    let people = document.getElementById("excPeople").value;
    let duration = document.getElementById("excDuration").value;
    let date = document.getElementById("excDate").value;
    let time = document.getElementById("excTime").value;

    // проверям если есть пустые поля
    if (time == "" || date == "" || duration == "" || people == "") {
        alert("Не все поля заполнены");
        return;
    }

    // создаём ссылку
    let url = genURL("orders");

    // формируем форму для отправки на сервер
    let form = new FormData();
    form.append("date", date);
    form.append("time", time);
    form.append("duration", duration);
    form.append("persons", people);
    form.append("price", price);
    form.append("route_id", currentRoute);
    form.append("guide_id", currentGuide);
    form.append("optionFirst", interguide);
    form.append("optionSecond", souvenirs);

    // отправляем заявку на сервер
    let res = await fetch(url, {
        method: "POST", // метод для отправки на сервер
        body: form
    });

    // сообщаем о результате пользователю
    if (res.status == 200) {
        alert("Заказ успешно оформлен!");
    } else {
        alert(`Произошла ошибка ${res.status}`);
    }
}

// функция заполнения формы оформления заказа
function fillform() {
    // Вытягиваем выбранного гида из спискав всех гидов
    let curguide;
    for (let guide of guides) {
        if (guide.id == currentGuide) {
            curguide = guide;
        }
    }
    // и записываем его имя в форму
    let guideName = document.getElementById("guideName");
    guideName.innerHTML = curguide.name;

    // аналогично поступаем с маршрутом
    let curroute;
    for (let route of routes) {
        if (route.id == currentRoute) {
            curroute = route;
        }
    }
    let routename = document.getElementById("rouName");
    routename.innerHTML = curroute.name;
    document.getElementById("interGuide").checked = false;
    document.getElementById("souvenirs").checked = false;
    calculateprice();
}

//при загрузке страницы выполняется содержимое
window.onload = async function () {
    routes = await getroutes();

    // Фильтруем эти маршруты, чтобы заполнить filteredroutes 
    // (из него берем маршуты для отображения)
    filerroutes();
    getObjects();
    // Находим поле фильтрации по названию маршрута
    let namefield = document.getElementById("routeName");
    // При его изменении фильтруем маршруты
    namefield.oninput = filerroutes;

    // Аналогично с селектором объектов
    let objselect = document.getElementById("mainObject");
    objselect.oninput = filerroutes;

    // ... и  с селектором языка
    let langselect = document.getElementById("langchange");
    langselect.oninput = filterguides;

    // ... и с опытом
    let expFrom = document.getElementById("expFrom");
    expFrom.oninput = filterguides;
    let expTo = document.getElementById("expTo");
    expTo.oninput = filterguides;

    // получаем модальное окно оформления заказа
    let ordermodal = document.getElementById("ordermodal");
    // и ждём когда оно откроется и заполняем форму
    ordermodal.addEventListener("show.bs.modal", fillform);

    // На поля формы вешаем функцию перерасчёта цены
    document.getElementById("interGuide").oninput = calculateprice;
    document.getElementById("souvenirs").oninput = calculateprice;
    document.getElementById("totalPrice").oninput = calculateprice;
    document.getElementById("excPeople").oninput = calculateprice;
    document.getElementById("excDuration").oninput = calculateprice;
    document.getElementById("excDate").oninput = calculateprice;
    document.getElementById("excTime").oninput = calculateprice;

    // вешаем заказ экскурсии на кнопку
    document.getElementById("orderBtn").onclick = order;
};