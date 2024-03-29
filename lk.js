"use strict";

const api = "2b774cf0-b34b-40b0-b336-db05869eb571";
const server = "http://exam-2023-1-api.std-900.ist.mospolytech.ru";

let orders = [];

function genURL(path) { //функция генерации ссылок
    let url = new URL(`${server}/api/${path}`);
    url.searchParams.set("api_key", api);
    return url;
};

// функция получения информации о маршруте 
async function getRoute(route_id) {
    let url = genURL(`routes/${route_id}`);
    let res = await fetch(url);

    if (res.status == 200) {
        let route = await res.json();
        return route;
    } else {
        return null;
    }
};

// отображение заказов
async function showorders(page) {
    let table = document.getElementById("ordertable");
    table.innerHTML = "";

    for (let i = (page - 1) * 5; i < Math.min(page * 5, orders.length); i++) {
        let row = document.createElement("tr");
        let idtd = document.createElement("td");
        idtd.innerHTML = orders[i].id;
        let nametd = document.createElement("td");

        let route = await getRoute(orders[i].route_id);
        if (route != null) {
            //получение название
            nametd.innerHTML = route.name;
        } else {
            nametd.innerHTML = "Не удалось получить название маршрута";
        }

        let datetd = document.createElement("td");
        datetd.innerHTML = orders[i].date;
        let pricetd = document.createElement("td");
        pricetd.innerHTML = orders[i].price + "₽";

        row.appendChild(idtd);
        row.appendChild(nametd);
        row.appendChild(datetd);
        row.appendChild(pricetd);

        table.appendChild(row);

    }
};

function showpagebtns(page) {//пагинация
    let pagesCount = Math.ceil(orders.length / 5);
    let pagemenu = document.querySelector(".pagination");
    pagemenu.innerHTML = "";
    let prevPageBtn = document.createElement("li");
    prevPageBtn.classList.add("page-item");
    // Создаём содержимое кнопки
    let prevPageLink = document.createElement("a");
    prevPageLink.classList.add("page-link");
    prevPageLink.innerHTML = "Предыдущая";
    prevPageBtn.appendChild(prevPageLink);

    // Делаем кнопку не активной, если мы на первой странице
    if (page == 1) {
        prevPageBtn.classList.add("disabled");
    } else {
        prevPageBtn.onclick = function () {
            showpagebtns(page - 1);
        };
    }

    pagemenu.appendChild(prevPageBtn);

    // Создаём кнопку перехода на следующую страницу
    let nextPageBtn = document.createElement("li");
    // Добавляем класс для бустрапа
    nextPageBtn.classList.add("page-item");
    let nextPageLink = document.createElement("a");
    nextPageLink.classList.add("page-link");
    nextPageLink.innerHTML = "Следующая";
    nextPageBtn.appendChild(nextPageLink);

    // Делаем кнопку не активной, если мы на последней странице
    if (page == pagesCount) {
        nextPageBtn.classList.add("disabled");
    } else {
        nextPageBtn.onclick = function () {
            showpagebtns(page + 1);
        };
    }

    // Создаём диапазон рисования кнопок
    let start = Math.max(page - 2, 1);
    let end = Math.min(page + 2, pagesCount);

    // Создаём кнопки
    for (let i = start; i <= end; i++) {
        let pageitem = document.createElement("li");
        pageitem.setAttribute("href", "#routestable");
        pageitem.classList.add("page-item");
        if (i == page) { // Помечаем кнопку выбранной страницы
            pageitem.classList.add("current");
        } else {
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
    showorders(page);
};

// получение списка заказов
async function getorders() {
    let url = genURL("orders");
    let res = await fetch(url);

    if (res.status == 200) {
        orders = await res.json();
    } else {
        alert("Не удалось загрузить заказы");
    }
};


window.onload = async function () {
    await getorders();
    showpagebtns(1);
};