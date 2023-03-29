let updater_reset = false;
window.electron.onUpdater((data) => {
    var u = document.getElementById('updater');

    u.classList.add('updating');
    clearTimeout(updater_reset);
    updater_reset = setTimeout(() => {
        u.classList.remove('updating');
    }, 10000);

    switch (data.event) {
        case 'noupdater':
            u.classList.add('d-none');
            break;
        case 'update-error':
            u.innerHTML = 'Update Error';
            break;
        case 'checking-for-update':
            u.innerHTML = 'Checking';
            break;
        case 'update-available':
            u.innerHTML = 'Update Available';
            break;
        case 'update-not-available':
            u.innerHTML = 'Up to Date';
            break;
        case 'download-progress':
            u.innerHTML = 'DL: ' + data.data.percent.toFixed(1) + '%';
            break;
        case 'update-downloaded':
            u.innerHTML = 'Downloaded! Click to restart';
            u.classList.remove('updating');
            u.classList.add('update_available');
            u.classList.remove('btn-outline-primary');
            u.classList.add('btn-outline-success');
            break;
    }
});
document.getElementById('updater').addEventListener('click', window.electron.updateCheck);

// so lazy
let links = document.getElementsByTagName('a');
for (let x=0;x<links.length;x++) {
    if (links[x].getAttribute('href').startsWith('https://')) {
        links[x].classList.add('website');
    }
}

document.addEventListener('click', (e) => {
    if (e.target.tagName == 'A') {
        if (e.target.getAttribute('href').startsWith('#')) {
            if (e.target.hasAttribute('data-client_id')) {
                window.electron.config.select(e.target.getAttribute('data-client_id'));
                // change to extension tag
                tab('config-tab');
                document.getElementById('run-tab').classList.add('disabled');
            }
            return;
        }
        e.preventDefault();
        window.electron.openWeb(e.target.getAttribute('href'));
    } else if (e.target.classList.contains('navigation_item')) {
        let tabTarget = e.target.getAttribute('targets');
        let itm = document.querySelector('.navigation_item.btn-outline-primary');
        if (itm) {
            itm.classList.remove('btn-outline-primary');
            itm.classList.add('btn-outline-secondary');
        }
        e.target.classList.add('btn-outline-primary');
        e.target.classList.remove('btn-outline-secondary');

        let tabItems = document.querySelectorAll('.tab_item');
        for (var x=0;x<tabItems.length;x++) {
            tabItems[x].classList.add('d-none');
        }

        let targetItem = document.getElementById(tabTarget);
        if (targetItem) {
            targetItem.classList.remove('d-none');
        }
    }
});

function resetErrors() {
    let loadings = document.getElementsByClassName('is-invalid');
    for (var x=0;x<loadings.length;x++) {
        loadings[x].classList.remove('is-invalid');
    }
}

/*
Create Stuff
*/
save_path_select.addEventListener('click', (e) => {
    e.preventDefault();
    window.electron.openDirectory();
});
window.electron.gotDirectory((data) => {
    save_path.value = data;
});

manifestdetails.addEventListener('submit', async (e) => {
    e.preventDefault();
    resetErrors();

    // check complete
    let error = false;
    if (extension_name.value == '') {
        extension_name.classList.add('is-invalid');
        error = true;
    }
    if (save_path.value == '') {
        save_path.classList.add('is-invalid');
        error = true;
    }
    if (extension_id.value == '') {
        extension_id.classList.add('is-invalid');
        error = true;
    }
    if (extension_secret.value == '') {
        extension_secret.classList.add('is-invalid');
        error = true;
    }
    if (owner_id.value == '') {
        owner_id.classList.add('is-invalid');
        error = true;
    }

    if (error) {
        return;
    }

    let record = {
        extension_name:     extension_name.value,
        save_path:          save_path.value,
        extension_id:       extension_id.value,
        extension_secret:   extension_secret.value,
        owner_id:           owner_id.value,
        extension_version:  extension_version.value
    }
    console.log(record);
    window.electron.attemptCreate(record);
});
window.electron.resultCreate((data) => {
    console.log('resultCreate', data);
    result.textContent = data;
});

/*
Refresh Stuff
*/
refresh_project_load.addEventListener('click', (e) => {
    window.electron.loadProjects();
});
window.electron.resultRefresh((data) => {
    console.log('resultRefresh', data);
    refresh_result.textContent = data;
});
window.electron.loadedProjects((projects) => {
    refresh_project_id.textContent = '';

    projects.forEach(project => {
        let opt = document.createElement('option');
        refresh_project_id.append(opt);

        opt.value = project.filePath;
        opt.textContent = project.name;
    });
});
manifestrefresh.addEventListener('submit', async (e) => {
    e.preventDefault();

    let targetFilePath = refresh_project_id.value;
    if (!targetFilePath || targetFilePath == '') {
        refresh_result.textContent = 'You probably need to Load Projects and pick a project first...';
        return;
    }

    window.electron.refreshProject({
        targetFilePath,
        ownerID: refresh_owner_id.value,
        version: refresh_extension_version.value
    });
});




reopen_project_select.addEventListener('click', (e) => {
    e.preventDefault();
    window.electron.openFile();
});
window.electron.gotFile((data) => {
    reopen_project.value = data.file;
    reopen_extension_clientid.value = data.clientID;
});
reopendetails.addEventListener('submit', async (e) => {
    e.preventDefault();

    let targetFilePath = reopen_project.value;
    if (!targetFilePath || targetFilePath == '') {
        reopen_result.textContent = 'You probably need to pick a Project to reopen first...';
        return;
    }

    window.electron.reopenProject({
        project: reopen_project.value,
        ownerID: reopen_owner_id.value,
        secret: reopen_extension_secret.value
    });
});
window.electron.resultReopen((data) => {
    console.log('resultReopen', data);
    reopen_result.textContent = data;
});






window.electron.rigLogin((data) => {
    try {
        let { id } = data;
        owner_id.value = id;
        refresh_owner_id.value = id;
        reopen_owner_id.value = id;
    } catch (e) {
    }
});

window.electron.ready();
