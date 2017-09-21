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

const MARKER = {
    NEWBIE: 'newbie_filter',
    VACATION: 'vacation_filter'
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

/**
 * @param {Event} e
 */
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

/**
 * @param {Event} e
 */
function triggeredByKey(e)
{
    [13, 37, 38, 39, 40].forEach(function(triggerKey) {
        if(e.which === triggerKey) {
            triggerWaitTable();
        }
    });
}

function triggerWaitTable()
{
    window.setTimeout(showHighscores, 500);
}

function showHighscores()
{
    arrayOf(document.querySelectorAll('.newRank'))
        .forEach(clearOldRank);

    arrayOf(allPlayersAndAllies())
        .filter(relevantPlayersAndAllies)
        .forEach(putRankUnderPlayerOrAlly);

    recalcGalaxyTableHeight();
}

/**
 * @param {Node|{remove:function()}} rank
 */
function clearOldRank(rank) {
    rank.remove();
}

/**
 * @returns {NodeList}
 */
function allPlayersAndAllies() {
    const selectors = [
        '.row:not(.empty_filter) .allytag>:first-child', // finds all allies
        '.row:not(.empty_filter) .playername>:first-child:not([rel=player99999])' // finds all players and filters destroyed planets
    ];
    return document.querySelectorAll(selectors.join(','));
}

/**
 * @param {Node} playerOrAlly
 * @returns {boolean}
 */
function relevantPlayersAndAllies(playerOrAlly) {
    const playerClassList = playerOrAlly.parentNode.parentNode.classList;
    return !isNewbieProtected(playerClassList) && !isVacationProtected(playerClassList);
}

/**
 * @param {DOMTokenList} classList
 * @returns {boolean}
 */
function isNewbieProtected(classList) {
    return classList.contains(MARKER.NEWBIE) && options.skipNewbie;
}

/**
 * @param {DOMTokenList} classList
 * @returns {boolean}
 */
function isVacationProtected(classList) {
    return classList.contains(MARKER.VACATION) && options.skipVacation;
}

/**
 * @param {Node} playerOrAlly
 */
function putRankUnderPlayerOrAlly(playerOrAlly) {
    var rank = document.querySelector('#playerName+li').innerText.replace(/.*\(|\).*/g, '');
    if (playerOrAlly.getAttribute('rel')) {
        rank = document.querySelector('#' + playerOrAlly.getAttribute('rel') + ' .rank a').innerText;
    }
    playerOrAlly.parentNode.appendChild(rankTag(options.rankText + ' ' + rank));
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

/**
 * @param {NodeList} nodeList
 * @returns {Array.<Element|Node>}
 */
function arrayOf(nodeList) {
    return Array.prototype.slice.call(nodeList);
}