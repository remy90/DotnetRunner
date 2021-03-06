const { addDeletegateEventListener } = require('../../eventUtils');
const applicationStore = require('../../applicationStore');
const dotnetProjectSelector = require('../../Components/DotnetProjectSelector');
const validateableForm = require('../../Components/ValidateableForm');

dotnetProjectSelector.register();

validateableForm.register();

document.addEventListener('DOMContentLoaded', onLoad);

function onLoad() {
    addDeletegateEventListener(document, 'form', 'submit', onFormSubmit);
    addDeletegateEventListener(document, '.delete-btn', 'click', onDeleteBtnClick);
    addDeletegateEventListener(document, '.edit-btn', 'click', (e) => {
        Array.from(document.querySelectorAll('.edit-btn, .delete-btn'))
            .forEach(x => x.setAttribute('disabled', 'disabled'));
        
            onEditBtnClick(e);
    });
    addDeletegateEventListener(document, '.button-cancel', 'click', reload);

    loadApps();
}

function loadApps() {
    const apps = applicationStore.getApplications();

    const template = document.querySelector('#dotnetAppRead');

    apps.forEach(({ name, cwd }, i) => {
        const clone = document.importNode(template.content, true);

        clone.querySelector('.app-name').textContent = name;
        clone.querySelector('.project-path').textContent = cwd;
        clone.querySelector("[type=hidden]").value = i;

        document.querySelector('.existing').appendChild(clone);
    });
}

function onEditBtnClick(e) {
    const container = e.target.parentNode;

    const index = container.querySelector('.index').value;
    const name = container.querySelector('.app-name').textContent;
    const projectPath = container.querySelector('.project-path').textContent;

    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }
    
    const template = document.querySelector('#dotnetAppEdit');
    const clone = document.importNode(template.content, true);

    container.appendChild(clone);

    container.querySelector('.app-name span').textContent = name;
    container.querySelector('[name="appName"]').value = name;
    container.querySelector('[name="projectPath"]').value = projectPath;
    container.querySelector("[type=hidden]").value = index;
}

function onDeleteBtnClick(e) {
    const container = e.target.parentNode;

    const index = container.querySelector("[type=hidden]").value;

    const apps = applicationStore.getApplications();

    apps.splice(index, 1);

    applicationStore.setApplications(apps);

    reload();
}

function onFormSubmit(e) {
    const data = new FormData(e.target);
    const index = data.get('appIndex');
    const payload = {
        name: data.get('appName'),
        cwd: data.get('projectPath')
    };

    const items = applicationStore.getApplications();

    if (index) {
        items[index] = payload;
    } else {
        items.push(payload);
    }

    applicationStore.setApplications(items);

    e.target.reset();
    e.preventDefault();

    e.target.querySelector('input').focus()

    reload();
}

function reload() {  
    const container = document.querySelector('.existing');

    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }

    loadApps();
}