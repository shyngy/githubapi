class View {
  constructor() {
    this.app = document.getElementById('app');

    this.searchInput = this.createElement('input', 'search-input');
    this.searchCounter = this.createElement('span', 'counter');
    this.searchLine = this.createElement('div', 'search-line');

    this.searchLine.append(this.searchInput);
    this.searchLine.append(this.searchCounter);

    this.usersWrapper = this.createElement('div', 'users-wrapper');
    this.usersList = this.createElement('div', 'users');
    this.usersWrapper.append(this.usersList);

    this.main = this.createElement('div', 'main');

    this.main.append(this.usersWrapper);
    this.app.append(this.searchLine);
    this.app.append(this.main);

    this.listedItems = document.getElementById('lists');
    this.listed = this.createElement('div', 'listed-item');
    this.listedItems.append(this.listed);
  }

  createElement(elementTag, elementClass) {
    const element = document.createElement(elementTag);
    if (elementClass) {
      element.classList.add(elementClass);
    }
    return element;
  }

  createSearchResult(repoData) {
    const searchResult = this.createElement('div', 'searchResult');

    searchResult.addEventListener('click', handleClick.bind(this));

    searchResult.innerHTML = `${repoData.name}`;
    this.usersList.append(searchResult);

    function handleClick(event) {
      event.currentTarget;

      this.searchInput.value = '';
      this.usersList.innerHTML = '';

      let element1 = document.createElement('div');
      let element2 = document.createElement('div');
      let element3 = document.createElement('div');

      element1.classList.add('list-item');
      element2.classList.add('list-item');
      element3.classList.add('list-item');

      element1.innerHTML = `Name: ${repoData.name}`;
      element2.innerHTML = `Owner: ${repoData.owner.login}`;
      element3.innerHTML = `Stars: ${repoData['stargazers_count']}`;

      const card = document.createElement('div');
      card.classList.add('card');

      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');

      let closeBtn = document.createElement('button');
      closeBtn.classList.add('close-btn');

      closeBtn.addEventListener('click', function remove() {
        card.remove();
        closeBtn.remove();
      });

      cardBody.appendChild(element1);
      cardBody.appendChild(element2);
      cardBody.appendChild(element3);
      cardBody.appendChild(closeBtn);

      card.appendChild(cardBody);

      this.listed.appendChild(card);
    }
  }
}

class Search {
  constructor(view) {
    this.view = view;

    this.view.searchInput.addEventListener(
      'keyup',
      this.debounce(this.searchUsers.bind(this), 250)
    );
  }

  async searchUsers() {
    let foundRepos = this.view.searchInput.value;

    if (foundRepos) {
      this.clearResults();
      return await fetch(
        `https://api.github.com/search/repositories?q=${foundRepos}&per_page=5`
      ).then((response) => {
        return response.json().then((res) => {
          for (let i = 0; i < res.items.length; i++) {
            this.view.createSearchResult(res.items[i]);
          }
        });
      });
    } else {
      this.clearResults();
    }
  }

  clearResults() {
    this.view.usersList.innerHTML = '';
  }

  debounce(fn, debounceTime) {
    let count;
    return function (...args) {
      clearTimeout(count);
      count = setTimeout(() => {
        fn.apply(this, args);
      }, debounceTime);
    };
  }
}

new Search(new View());
