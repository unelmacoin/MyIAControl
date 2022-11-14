// about:debugging - Adding temporary addon to Firefox
// about:addons - Configuring addon

function onSettingsGet(result) {
  if (result.acdn_rules) {
    const loc = document.location;

    for (let k in result.acdn_rules) {
      let hostStr = result.acdn_rules[k].site
        .replace(/\./, '\\.')
        .replace(/\*/, '(.*)');
      const hostRe = new RegExp('^' + hostStr + '$');
      if (
        hostRe.test(document.location.hostname) &&
        timeIsInInterval(
          result.acdn_rules[k].timeFrom,
          result.acdn_rules[k].timeTo
        )
      ) {
        document.body.innerHTML = "<h1 style='margin:15px auto;'>NOPE</h1>";
        break;
      }
    }
  }
}

function timeIsInInterval(timeFrom, timeTo) {
  let currentDate = new Date();
  let minutes = currentDate.getMinutes();
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  let curTime = parseInt(currentDate.getHours() + '' + minutes);
  timeFrom = parseInt(timeFrom.replace(':', ''));
  timeTo = parseInt(timeTo.replace(':', ''));

  return timeFrom <= curTime && curTime <= timeTo;
}

function onError(error) {
  console.log('Error with MyIAControl addon: ', error);
}

let getting = browser.storage.local.get('acdn_rules');
getting.then(onSettingsGet, onError);
