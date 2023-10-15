// TODO: write code here

class MyTrello {
  constructor() {
    this.container = document.querySelector(".container");
    this.body = document.querySelector("body");
  }
  addTaskCard() {
    // Добавление новой карточки
    let counter = 1;
    this.container.addEventListener("click", (e) => {
      if (e.target.classList.contains("button_add")) {
        console.log("Вы нажали на кнопку добаить карту");
        let addCards = e.target
          .closest(".column-line")
          .querySelectorAll(".column-line_item");
        const insertCard = `<!--карточка-->
<div draggable="true" class="column-line_item" data-id = ${counter}>
  <!--Заголовок карточки-->
  <span class="column-line_item-header">Имя задачи</span>
  <!--крестик закрыть-->
  <div class="column-line_item__cross-close"></div>
  <!--Текст карточки-->
  <textarea
    class="column-line_item_content"
    placeholder="Запишите задачу"
  ></textarea>
</div>`;
        counter++;
        if (addCards.length !== 0) {
          addCards[addCards.length - 1].insertAdjacentHTML(
            "afterEnd",
            insertCard
          );
        } else if (addCards.length === 0) {
          e.target.insertAdjacentHTML("beforeBegin", insertCard);
        }
      }
      //************************************ */ записываем состояние в LocalStorage
      this.updateLocalStorage();
    });
  }
  deleteTaskCard() {
    this.container.addEventListener("click", (e) => {
      if (e.target.classList.contains("column-line_item__cross-close")) {
        console.log("Вы нажали на кристик - удалить");
        e.target.closest(".column-line_item").remove(); // удалить карточку
      }
      //************************** */ // записываем состояние в LocalStorage
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
      }
    };

    this.container.addEventListener("dragstart", (e) => {
      if (e.target.classList.contains("column-line_item")) {
        console.log("Вы нажали КАРТОЧКУ ДЛЯ ПЕРЕТАСКИВАНИЯ");
        actulElement = e.target;
        actulElement.classList.add("dragget");
        document.documentElement.addEventListener("dragend", onDragend);
        document.documentElement.addEventListener("dragover", onDragover);
      }
    });
  }
  updateLocalStorage() {
    debugger;
    const condition = {
      /*col_0: [{},{}],
      col_1: [{},{}],
      col_2: [{},{}],*/
    };

    const columnLine = document.querySelectorAll(".column-line"); // столбцы с карточками

    columnLine.forEach((line, indexLine) => {
      let columnId = line.dataset.columnid;

      let taskCard = line.querySelectorAll(".column-line_item"); // карточки в каждом столбце

      taskCard.forEach((card, indexCard) => {
        let id = card.dataset.id;
        let content = card.querySelector(
          ".column-line_item_content"
        ).textContent;
        let dataBody = { id, content };

        condition[`col_${columnId}`] = dataBody[indexCard];
        console.log(condition);
      });
    });
  }

  setNullLocalStorage() {
    window.addEventListener("beforeunload", () => {
      localStorage.removeItem("Condition");
    });
  }
}

const myTrello = new MyTrello();

myTrello.addTaskCard(); // добавление новой карточки
myTrello.deleteTaskCard(); // удаление карточки
myTrello.cardDragget(); // перетаскивание
