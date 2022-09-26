const API_BASE_URL = 'https://api.nobelprize.org/v1/';

  /**
   *
   * @param {string} url
   * @param {(err: Error, data: any) => void} cb
   */
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status <= 299) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Your request failed'));
    xhr.send();
  }

  /**
   *
   * @param {string} name
   * @param {HTMLElement} parent
   * @param {{[key: string]: string}} options
   */
  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.entries(options).forEach(([key, value]) => {
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  /**
   *
   * @param {Error} err
   */
  function renderError(err) {
    const listContainer = document.getElementById('list-container');
    listContainer.innerHTML = '';
    const root = document.getElementById('root');
    createAndAppend('div', root, {
      text: err.message,
      class: 'alert alert-error',
    });
  }

  /**
   *
   * @param {HTMLElement} tbody
   * @param {string} label
   * @param {string} value
   */
  function addRow(tbody, label, value) {
    const tr = createAndAppend('tr', tbody);
    createAndAppend('td', tr, { text: `${label}:`, class: 'label' });
    createAndAppend('td', tr, { text: value });
  }

  /**
   *
   * @param {HTMLElement} tbody
   * @param {any[]} prizes
   */
  function renderLaureatePrizes(tbody, prizes) {
    const tr = createAndAppend('tr', tbody);
    createAndAppend('td', tr, { text: 'Prizes:', class: 'label' });
    const td = createAndAppend('td', tr);
    const ul = createAndAppend('ul', td);
    prizes.forEach(prize => {
      const li = createAndAppend('li', ul);
      createAndAppend('span', li, { text: `${prize.year}, ${prize.category}` });
      if (prize.motivation) {
        createAndAppend('span', li, {
          text: `: ${prize.motivation}`,
          class: 'motivation',
        });
      }
    });
  }

  /**
   *
   * @param {any[]} laureates
   * @param {HTMLElement} listContainer
   */
  function renderLaureates(laureates, listContainer) {
    laureates.forEach(laureate => {
      const { surname, firstname } = laureate;
      const div = createAndAppend('li', listContainer, {
        class: 'list-item',
      });
      const table = createAndAppend('table', div);
      const tbody = createAndAppend('tbody', table);
      addRow(tbody, 'Name', `${firstname} ${surname || ''} `);
      addRow(
        tbody,
        'Born',
        `${laureate.born}, ${laureate.bornCity}, ${laureate.bornCountry}`
      );
      if (laureate.died !== '0000-00-00') {
        addRow(
          tbody,
          'Died',
          `${laureate.died}, ${laureate.diedCity}, ${laureate.diedCountry}`
        );
      }
      renderLaureatePrizes(tbody, laureate.prizes);
    });
  }

  /**
   *
   * @param {string} countryCode
   * @param {HTMLElement} ul
   */
  function onChangeSelect(countryCode, ul) {
    ul.innerHTML = '';

    fetchJSON(
      `${API_BASE_URL}/laureate.json?bornCountryCode=${countryCode}`,
      (err, data) => {
        if (err) {
          renderError(err);
          return;
        }
        renderLaureates(data.laureates, ul);
      }
    );
  }

  function main() {
    const root = document.getElementById('root');
    createAndAppend('h1', root, { text: 'Nobel Prize Laureates' });
    const header = createAndAppend('header', root);
    const ul = createAndAppend('ul', root, { id: 'list-container' });

    /* prettier-ignore */
    const select = /**@type HTMLSelectElement*/ (createAndAppend(
      'select',
      header
    ));
    createAndAppend('option', select, {
      text: 'Select a country',
      disabled: 'disabled',
      selected: 'selected',
    });

    fetchJSON(`${API_BASE_URL}/country.json`, (err, data) => {
      if (err) {
        renderError(err);
        return;
      }

      /**@type {{code: string, name: string}[]} */
      const countries = data.countries;

      countries
        .filter(country => country.code !== undefined)
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(country => {
          createAndAppend('option', select, {
            text: country.name,
            value: country.code,
          });
        });

      select.addEventListener('change', () => {
        onChangeSelect(select.value, ul);
      });
    });
  }

  window.onload = main;
