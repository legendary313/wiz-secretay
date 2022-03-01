document
  .querySelector(".create-todo-item")
  .addEventListener("click", function () {
    document.querySelector(".new-todo-item").style.display = "block";
  });

document
  .querySelector(".new-todo-item button")
  .addEventListener("click", function () {
    var itemName = document.querySelector(".new-todo-item input").value;
    if (itemName && itemName !== "") {
      var itemsStorage = localStorage.getItem("todo-items");
      let itemsArray;
      if (!itemsStorage) {
        itemsArray = [];
      } else {
        itemsArray = JSON.parse(itemsStorage);
      }
      itemsArray.push({ item: itemName, status: 0 });
      saveItems(itemsArray);
      fetchItems();
      document.querySelector(".new-todo-item input").value = "";
      document.querySelector(".new-todo-item").style.display = "none";
    }
  });

function fetchItems() {
  const itemsList = document.querySelector("ul.todo-items");
  itemsList.innerHTML = "";
  var newItemHTML = "";
  try {
    var items = localStorage.getItem("todo-items");
    if (items) {
      var itemsArray = JSON.parse(items);
      for (var i = 0; i < itemsArray.length; i++) {
        var status = "";
        if (itemsArray[i].status == 1) {
          status = 'class="done"';
        }
        newItemHTML += `<li data-itemindex="${i}" ${status}>
                                <span class="item">${itemsArray[i].item}</span>
                                <div>
                                <span class="itemComplete">
                                    <img src="icons/check.svg" alt="check" />
                                </span>
                                <span class="itemDelete"> 
                                <img src="icons/remove.svg" alt="remove" /></span>
                                </div>
                            </li>`;
      }
      itemsList.innerHTML = newItemHTML;

      var itemsListUL = document.querySelectorAll("ul li");
      for (var i = 0; i < itemsListUL.length; i++) {
        itemsListUL[i]
          .querySelector(".itemComplete")
          .addEventListener("click", function () {
            var index = this.parentNode.parentNode.dataset.itemindex;
            itemComplete(index);
          });
        itemsListUL[i]
          .querySelector(".itemDelete")
          .addEventListener("click", function () {
            var index = this.parentNode.parentNode.dataset.itemindex;
            console.log(index);
            itemDelete(index);
          });
      }
      var numberOfIncompleteTasks = itemsArray.filter(
        (item) => item.status == 0
      ).length;
      if (numberOfIncompleteTasks === 0) {
        chrome.action.setBadgeBackgroundColor({ color: "#00FF00" });
      } else {
        chrome.action.setBadgeBackgroundColor({ color: "red" });
      }
      chrome.action.setBadgeText({
        text: numberOfIncompleteTasks.toString(),
      });
    }
  } catch (e) {
    alert("Some errors occurred while fetching, see in console");
    console.log(e);
  }
}

function itemComplete(index) {
  var items = localStorage.getItem("todo-items");
  var itemsArray = JSON.parse(items);

  itemsArray[index].status = 1;

  saveItems(itemsArray);
  console.log(itemsArray);
  document.querySelector(
    'ul.todo-items li[data-itemindex="' + index + '"]'
  ).className = "done";
}

function itemDelete(index) {
  var items = localStorage.getItem("todo-items");
  var itemsArray = JSON.parse(items);

  itemsArray.splice(index, 1);

  saveItems(itemsArray);

  document
    .querySelector('ul.todo-items li[data-itemindex="' + index + '"]')
    .remove();
}

function saveItems(item) {
  var string = JSON.stringify(item);
  console.log(string);
  localStorage.setItem("todo-items", string);
}

fetchItems();
