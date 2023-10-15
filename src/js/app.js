// TODO: write code here
class MyTrello {
  constructor() {
    this.container = document.querySelector(".container");
    this.body = document.querySelector("body");
    this.insertCard = `
    <div draggable="true" class="column-line_item">
      <span class="column-line_item-header">Имя задачи</span>
      <div class="column-line_item__cross-close"></div>
      <textarea
        class="column-line_item_content"
        autocomplete="on"
        placeholder="Запишите задачу"
      ></textarea>
    </div>`;
  }

  addTaskCard() {
    // Добавление новой карточки
    this.container.addEventListener("click", (e) => {
      if (e.target.classList.contains("button_add")) {
        console.log("Вы нажали на кнопку добаить карту");
        let addCards = e.target
          .closest(".column-line")
          .querySelectorAll(".column-line_item");
        if (addCards.length !== 0) {
          addCards[addCards.length - 1].insertAdjacentHTML(
            "afterEnd",
            this.insertCard
          );
        } else if (addCards.length === 0) {
          e.target.insertAdjacentHTML("beforeBegin", this.insertCard);
        }
      }
      this.updateLocalStorage();
    });
  }

  deleteTaskCard() {
    this.container.addEventListener("click", (e) => {
      if (e.target.classList.contains("column-line_item__cross-close")) {
        console.log("Вы нажали на кристик - удалить");
        e.target.closest(".column-line_item").remove(); // удалить карточку
      }
      this.updateLocalStorage();
    });
  }

  cardDragget() {
    let actulElement;
    const onDragover = (e) => {
      e.preventDefault();
      const currentEl = e.target.closest(".column-line_item");
      const moveEl = actulElement !== currentEl;
      if (!moveEl) return;
      if (currentEl) {
        e.target.closest(".column-line").insertBefore(actulElement, currentEl);
      } else {
        if (e.target.closest(".column-line")) {
          let botton = e.target
            .closest(".column-line")
            .querySelector(".button_add");
          botton.insertAdjacentElement("beforebegin", actulElement);
        }
      }
    };
    const onDragend = (e) => {
      if (e.target.classList.contains("column-line_item")) {
        actulElement.classList.remove("dragget");
        this.updateLocalStorage();
      }
    };
    this.container.addEventListener("dragstart", (e) => {
      if (e.target.classList.contains("column-line_item")) {
        actulElement = e.target;
        actulElement.classList.add("dragget");
        document.documentElement.addEventListener("dragend", onDragend);
        document.documentElement.addEventListener("dragover", onDragover);
      }
    });
  }
  updateLocalStorage() {
    const condition = [];
    const columnLine = document.querySelectorAll(".column-line"); // столбцы с карточками
    columnLine.forEach((line, indexLine) => {
      condition[indexLine] = [];
      let taskCard = line.querySelectorAll(".column-line_item"); // карточки в каждом столбце
      taskCard.forEach((card, indexCard) => {
        let content = card.querySelector(".column-line_item_content").value;
        let dataBody = [content];
        condition[indexLine][indexCard] = dataBody;
      });
    });
    let database = JSON.stringify(condition);
    window.localStorage.setItem("database", database);
  }

  loadFromLocalStorage() {
    let getDataBase = localStorage.getItem("database");
    let dataBase = JSON.parse(getDataBase);
    const columnLine = document.querySelectorAll(".column-line");
    for (let i = 0; i < dataBase.length; i++) {
      for (let j = 0; j < dataBase[i].length; j++) {
        columnLine[i].querySelector(".button_add").insertAdjacentHTML(
          "beforeBegin",
          `<!--карточка-->
      <div draggable="true" class="column-line_item">
        <!--Заголовок карточки-->
        <span class="column-line_item-header">Имя задачи</span>
        <!--крестик закрыть-->
        <div class="column-line_item__cross-close"></div>
        <!--Текст карточки-->
        <textarea
          class="column-line_item_content"
          autocomplete="on"
          placeholder="Запишите задачу"
        >${dataBase[i][j]}</textarea>
      </div>`
        );
      }
    }
  }
}

const myTrello = new MyTrello();
myTrello.loadFromLocalStorage(); //
myTrello.addTaskCard(); // добавление новой карточки
myTrello.deleteTaskCard(); // удаление карточки
myTrello.cardDragget(); // перетаскивание
