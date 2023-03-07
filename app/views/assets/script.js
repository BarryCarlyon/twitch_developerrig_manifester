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
window.electron.ready();
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
    }
});

function resetErrors() {
    let loadings = document.getElementsByClassName('is-invalid');
    for (var x=0;x<loadings.length;x++) {
        loadings[x].classList.remove('is-invalid');
    }
}

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
