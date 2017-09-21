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

    arrayOf(allPlayersAndAllies())
        .filter(function (playerOrAlly) {
            const classList = playerOrAlly.parentNode.parentNode.classList;
            return !classList.contains('newbie_filter') || options.skipNewbie === false
        })
        .filter(function (playerOrAlly) {
            const classList = playerOrAlly.parentNode.parentNode.classList;
            return !classList.contains('vacation_filter') || options.skipVacation === false
        })
        .forEach(function (playerOrAlly) {
            var rank = document.querySelector('#playerName+li').innerText.replace(/.*\(|\).*/g, '');
            if (playerOrAlly.getAttribute('rel')) {
                rank = document.querySelector('#' + playerOrAlly.getAttribute('rel') + ' .rank a').innerText;
            }
            playerOrAlly.parentNode.appendChild(rankTag(options.rankText + ' ' + rank));
        });

    recalcGalaxyTableHeight();
}

/**
 * @param {NodeList} nodeList
 * @returns {Array.<Element|Node>}
 */
function arrayOf(nodeList) {
    return Array.prototype.slice.call(nodeList);
}

/**
 * @returns {NodeList}
 */
function allPlayersAndAllies() {
    const selectors = [
        '.row:not(.empty_filter) .allytag>:first-child', // finds all allies
        '.row:not(.empty_filter) .playername>:first-child' // finds all players
    ];
    return document.querySelectorAll(selectors.join(','));
}

/**
 * @param {string} text
 * @returns {Element}
 */
function rankTag(text) {
    var rankTag = document.createElement('span');
    rankTag.classList.add('newRank');
    rankTag.textContent = text;
    return rankTag;
}

function recalcGalaxyTableHeight()
{
    var presetHeaderFooterHeight = 112;
    var calculatedHeight = presetHeaderFooterHeight + document.querySelector('#galaxytable tbody').clientHeight;
    document.getElementById('galaxytable').style.height = calculatedHeight+'px';
}