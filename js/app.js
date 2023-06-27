(function () {
  app.portfolioItems = [];
  app.selectedItem = {};

  app.homepage = function () {
    setCopyrightDate();
  };

  app.portfolio = function () {
    setCopyrightDate();
  };

  app.workItem = function () {
    setCopyrightDate();
    loadPageData().then(() => {
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
})((window.app = window.app || {}));
