var defaultOptions = {
    'title': 'Ogame Galaxy Highscore',
    'isActive': true,
    'showHighscoreInGalaxyView': true,
    'showOriginalColors': true,
    'rankText': 'Rank: ',
    'skipVacation': true,
    'skipNewbie': true,
    'skipInactive': false,
    'allyRanks': true
};



// Saves options to chrome.storage.sync.
function save_options() {
    var saveOptions = {};
    for(var key in defaultOptions)
    {
        var el = document.getElementById(key);
        var value = '';
        if(el)
        {
            if (el.type && el.type === 'checkbox')
            {
                value = el.checked;
            }
            else
            {
                value = el.value;
            }
            saveOptions[key] = value;
        }
    }
    chrome.storage.sync.set(saveOptions, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get(defaultOptions, function(storageOptions) {
        for(var key in storageOptions)
        {
            var value = storageOptions[key];
            var el = document.getElementById(key);
            console.log('key', key);
            console.log('value', value);
            if(el)
            {
                if (el.type && el.type === 'checkbox')
                {
                    el.checked = value;
                }
                else
                {
                    el.value = value;
                }
            }
        }
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);