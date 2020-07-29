/**
 * Function to execute everyday updating the Google Drive Suscription to Push Notifications
 *
 * @param {object} Time driven request event object
 * @return {Void}
 */
function onTrigger(e) {
  let scriptProperties = PropertiesService.getScriptProperties();
  
  let data = JSON.parse(scriptProperties.getProperty('channelResource'));
      
  let expiration = parseInt(data['expiration']);
  
  let expirationDate = new Date(expiration);
  
  if(isTomorrow(expirationDate)) {
    stopWatch();
    initWatch();
  } else if(isInThePast(expiration)) {
    initWatch();
  }
}