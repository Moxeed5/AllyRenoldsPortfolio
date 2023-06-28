(function () {
  app.portfolioItems = [];
  app.selectedItem = {};

  app.homepage = function () {
    setCopyrightDate();
  };

  app.portfolio = async function () {
    setCopyrightDate();
    await loadPageData();
    loadNavMenu();
    loadPortfolioPageData();
  };

  app.workItem = function () {
    setCopyrightDate();
    loadPageData().then(() => {
      loadNavMenu();
      loadSpecificItem();
      updateItemPage();
    });
  };

  function setCopyrightDate() {
    const date = new Date();
    document.getElementById('copyrightYear').innerText = date.getFullYear();
  }

  function wireContactForm() {
    const contactForm = document.getElementById('contact-form');
    contactForm.onsubmit = contactFormSubmit;
  }

  function contactFormSubmit(e) {
    e.preventDefault();
    const contactForm = document.getElementById('contact-form');
    const name = contactForm.querySelector('#name').value;
    const email = contactForm.querySelector('#email').value;
    const message = contactForm.querySelector('#message').value;

    const mailTo = `mailto:${email}?subject=Contact From ${name}&body=${message}`;

    const mailLink = document.createElement('a');
    mailLink.href = mailTo;
    mailLink.target = '_blank';
    mailLink.style.display = 'none';

    document.body.appendChild(mailLink);
    mailLink.click();
    document.body.removeChild(mailLink);
  }

  // Wire up the contact form
  wireContactForm();

  name.value = '';
  email.value = '';
  message.value = '';

  async function loadPageData() {
    const cacheData = sessionStorage.getItem('site-data');

    if (cacheData !== null) {
      app.portfolioItems = JSON.parse(cacheData);
    } else {
      const rawData = await fetch('sitedata.json');
      const data = await rawData.json();
      app.portfolioItems = data;
      sessionStorage.setItem('site-data', JSON.stringify(data));
    }
  }

  function loadSpecificItem() {
    const params = new URLSearchParams(window.location.search);
    let item = parseInt(params.get('item'));

    if (item > app.portfolioItems.length || item < 1) {
      item = 1;
    }

    app.selectedItem = app.portfolioItems[item - 1];
    app.selectedItem.id = item;
  }

  function updateItemPage() {
    const header = document.getElementById('work-item-header');
    header.innerText = `${app.selectedItem.id}. ${app.selectedItem.title}`;

    const image = document.getElementById('work-item-image');
    image.src = app.selectedItem.largeImage;
    image.alt = app.selectedItem.largeImageAlt;

    const projectText = document
      .getElementById('project-text')
      .querySelector('p');
    projectText.innerText = app.selectedItem.projectText;

    const technologies = document
      .getElementById('technologies-text')
      .querySelector('ul');
    technologies.innerHTML = '';
    app.selectedItem.technologies.forEach((technology) => {
      const li = document.createElement('li');
      li.innerText = technology;
      technologies.appendChild(li);
    });

    const challengesText = document
      .getElementById('challenges-text')
      .querySelector('p');
    challengesText.innerText = app.selectedItem.challengesText;
  }

  function loadPortfolioPageData() {
    const originalItems = document.querySelectorAll('.highlight');
    const main = document.getElementById('portfolio-main');
    const newItems = [];

    for (let i = 0; i < app.portfolioItems.length; i++) {
      const el = app.portfolioItems[i];

      const highlight = document.createElement('div');
      highlight.classList.add('highlight');
      if (i % 2 > 0) {
        highlight.classList.add('invert');
      }

      const textDiv = document.createElement('div');
      const h2 = document.createElement('h2');
      const a = document.createElement('a');

      const titleWords = el.title.split(' ');
      let title = `0${i + 1}. `;

      for (let j = 0; j < titleWords.length - 1; j++) {
        title += titleWords[j];
        title += '<br />';
      }
      title += titleWords[titleWords.length - 1];

      h2.innerHTML = title;
      a.href = `workitem.html?item=${i + 1}`;
      a.innerText = 'see more';

      textDiv.appendChild(h2);
      textDiv.appendChild(a);

      highlight.appendChild(textDiv);

      const img = document.createElement('img');
      img.src = el.smallImage;
      img.alt = el.smallImageAlt;
      highlight.append(img);

      newItems.push(highlight);
    }
    originalItems.forEach((el) => el.remove());
    newItems.forEach((el) => main.appendChild(el));
  }

  function loadNavMenu() {
    const originalNav = document.querySelectorAll('.work-item-nav');
    const nav = document.querySelector('nav ul');

    originalNav.forEach((el) => el.remove());

    for (let i = 0; i < app.portfolioItems.length; i++) {
      const li = document.createElement('li');
      li.classList.add('work-item-nav');
      const a = document.createElement('a');
      a.href = `workitem.html?item=${i + 1}`;
      a.innerText = `Item #${i + 1}`;

      li.appendChild(a);
      nav.appendChild(li);
    }
  }
})((window.app = window.app || {}));
