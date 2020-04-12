/**
 * Gets startPageToken for user to subscribe to its changes.
 *
 * @return {string} the startPageToken
 */
function getStartPageToken() {
  return Drive.Changes.getStartPageToken().startPageToken;
}

/**
 * Subscribe your address to start receiving Push notifications for Google Drive changes on the account
 *
 * @return {string} the startPageToken
 */
function initWatch() {
  
  let scriptProperties = PropertiesService.getScriptProperties();
  
  let pageToken = getStartPageToken();
  
  let resource = {
    'id': scriptProperties.getProperty('webhookId'),
    'type': 'web_hook',
    'address': scriptProperties.getProperty('watcherAddress'),
    'payload': true,
    'pageToken': pageToken,
    'expiration': getExpirationTimestamp()
  };
  
  let url = `https://www.googleapis.com/drive/v3/changes/watch?pageToken=${pageToken}`;

  let options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ScriptApp.getOAuthToken()}`,
      'Content-Type': 'application/json'
    },
    muteHttpExceptions: true,
    payload: JSON.stringify(resource)
  };

  let res = UrlFetchApp.fetch(url, options);

  let channelMetadata = JSON.parse(res.getContentText());

  Logger.log(channelMetadata)
  
  scriptProperties.setProperty('channelResource', res.getContentText())
  scriptProperties.setProperty('pageToken', pageToken)
  
  console.log(channelMetadata);
  
  return channelMetadata;
}

/**
 * Unsubscribe your address from receiving Push notifications for Google Drive
 * changes on the account
 *
 */
function stopWatch() {
  let scriptProperties = PropertiesService.getScriptProperties();
  
  Drive.Channels.stop(scriptProperties.getProperty('channelResource'));
  
  scriptProperties.deleteProperty('channelResource');
  scriptProperties.deleteProperty('pageToken');
}

/**
 * List changes made to the user's Google Drive from the last time listed
 *
 * @return {object} Google Drive changes result resource
 */
function listChanges() {
  let scriptProperties = PropertiesService.getScriptProperties();
  
  let lock = LockService.getScriptLock();
  
  lock.tryLock(30000);
  
  let pageToken = scriptProperties.getProperty('pageToken');
  
  let url = `https://www.googleapis.com/drive/v3/changes?pageToken=${pageToken}`;

  let options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${ScriptApp.getOAuthToken()}`,
      'Content-Type': 'application/json'
    },
    muteHttpExceptions: true
  };

  let res = UrlFetchApp.fetch(url, options);

  let contentText = res.getContentText();

  console.log(contentText);

  let jsonResponse = JSON.parse(contentText);

  if(jsonResponse['newStartPageToken']) {
    scriptProperties.setProperty('pageToken', jsonResponse['newStartPageToken'])
  }

  lock.releaseLock();

  return jsonResponse;
  
  
}

/**
 * Gets last newStartPageToken for the user's account
 *
 * @return {string} last newStartPageToken
 */
function getLastPageToken() {
  
  let lock = LockService.getScriptLock();
  
  lock.tryLock(30000);
  
  let scriptProperties = PropertiesService.getScriptProperties();
  
  let startPageToken = getStartPageToken();
  
  let baseUrl = 'https://www.googleapis.com/drive/v3/changes?fields=newStartPageToken&pageToken='
  let url = baseUrl + startPageToken;

  let oauthToken = ScriptApp.getOAuthToken();
  let options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${ScriptApp.getOAuthToken()}`,
      'Content-Type': 'application/json'
    },
    muteHttpExceptions: false
  };
  
  let res = UrlFetchApp.fetch(url, options);
  let stringResponse = res.getContentText();
  let jsonResponse = JSON.parse(res.getContentText());
  Logger.log(res.getContentText())

  let lastPageToken = jsonResponse['newStartPageToken'];

  while(lastPageToken) {
    
    res = UrlFetchApp.fetch(baseUrl + lastPageToken, options);
    jsonResponse = JSON.parse(res.getContentText());
    
    if(jsonResponse['newStartPageToken']) {
      if(lastPageToken == jsonResponse['newStartPageToken']) {
        break;
      }
      lastPageToken = jsonResponse['newStartPageToken'];
    }
    
    Logger.log(lastPageToken)
    console.log(lastPageToken)
  }

  scriptProperties.setProperty('pageToken', lastPageToken);
  lock.releaseLock();

  return lastPageToken;
}
