var options = {};
var defaultOptions = {
    'title': 'Ogame Galaxy Highscore',
    'isActive': true,
    'showHighscoreInGalaxyView': true,
    'showOriginalColors': true,
    'rankText': 'Rank:',
    'skipVacation': true,
    'skipNewbie': true,
    'skipInactive': false,
    'allyRanks': true
};


chrome.storage.sync.get(defaultOptions, function(storageOptions) {
    options = storageOptions;
    console.log('options', options);
    start();
});

function start()
{
    if(options.isActive)
    {
        document.addEventListener("click", triggeredByClick);
        document.addEventListener("keyup", triggeredByKey);

        triggerWaitTable();
    }
}

function triggeredByClick(e)
{
    console.log('e',e);
    console.log('e target', e.target);
    if(e.target.classList)
    {
        if(e.target.classList.contains('galaxy_icons') || e.target.classList.contains('btn_blue'))
        {
            triggerWaitTable();
        }
    }
}

function triggeredByKey(e)
{
    var triggeredKeys = [13, 37, 38, 39, 40];
    for(var i = 0; i < triggeredKeys.length; i++)
    {
        var k = triggeredKeys[i];
        if(e.which === k)
        {
            triggerWaitTable();
        }
    }
}

function triggerWaitTable()
{
    window.setTimeout(function(){
        showHighscores();
    }, 500);
}

function showHighscores()
{
    var oldRanks = document.querySelectorAll('.newRank');
    if(oldRanks.length)
    {
        for(var i = 0; i < oldRanks.length; i++)
        {
            var oldRank = oldRanks[i];
            oldRank.remove();
        }
    }

    var rows = document.querySelectorAll('#galaxytable .row');
    for(i = 0; i < rows.length; i++)
    {
        var row = rows[i];
        if(row.classList)
        {
            if(row.classList.contains('empty_filter') || (options.skipVacation && row.classList.contains('vacation_filter')) || (options.skipNewbie && row.classList.contains('newbie_filter')))
            {
                continue;
            }
        }
        var position = parseInt(row.childNodes[1].innerText);
        var fieldToWriteIn = document.querySelector('.js_playerName'+position);
        var tooltip = fieldToWriteIn.lastElementChild;
        if(tooltip.classList && tooltip.classList.contains('status'))
        {
            if(fieldToWriteIn.innerText === '')
            {
                continue;
            }
        }
        var rank = tooltip.lastElementChild!==null ? tooltip.lastElementChild.firstElementChild.lastElementChild.innerText : document.querySelectorAll('#bar ul li')[1].innerText;
        if(tooltip.lastElementChild === null)
        {
            rank = rank.match(/\(([^)]+)\)/)[1];
        }
        var originalCssClassList = tooltip.lastElementChild!== null ? (fieldToWriteIn.firstElementChild.tagName === 'A' ? fieldToWriteIn.firstElementChild.firstElementChild.classList : fieldToWriteIn.childNodes[3].firstElementChild.classList) : 'status_abbr_active';

        var newRank = document.createElement('span');
        newRank.classList = originalCssClassList;
        newRank.classList.add('newRank');
        newRank.textContent = options.rankText+' '+rank;
        fieldToWriteIn.appendChild(newRank);

        if(options.allyRanks)
        {
            var allyFieldToWriteIn = document.querySelector('.js_allyTag'+position);
            var allyTooltip = allyFieldToWriteIn.lastElementChild;
            if(null!==allyTooltip) {
                var allyRank = allyTooltip.lastElementChild.lastElementChild.firstElementChild.innerText;
                allyRank = allyRank.substr(allyRank.indexOf(':') + 2);

                var newAllyRank = document.createElement('span');
                newAllyRank.classList.add('newRank');
                newAllyRank.textContent = options.rankText + ' ' + allyRank;
                allyFieldToWriteIn.appendChild(newAllyRank);
            }
        }
    }
    recalcGalaxyTableHeight();
}

function recalcGalaxyTableHeight()
{
    var presetHeaderFooterHeight = 112;
    var calculatedHeight = presetHeaderFooterHeight + document.querySelector('#galaxytable tbody').clientHeight;
    document.getElementById('galaxytable').style.height = calculatedHeight+'px';
}