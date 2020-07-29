/**
 * Gets a UNIX timestamp for 7 days from now
 *
 * @return {number} UNIX timestamp in milliseconds
 */
function getExpirationTimestamp() {
  let today = new Date();
  
  let currentDay = today.getDate();
  
  let sevenDaysFromToday = currentDay + 7;

  today.setDate(sevenDaysFromToday)
    
  return today.getTime();
  
}

/**
 * Checks if a date if tomorrow
 *
 * @param {date} Date to check
 * @return {boolean} True if date is tommorow, False if not
 */
function isTomorrow(date) {
  let today = new Date();
  return today.getDate() == (date.getDate() - 1) && today.getMonth() == date.getMonth() && today.getFullYear() == today.getFullYear();
}

/**
 * Checks if a date is in the past
 *
 * @param {date} Timestamp to check
 * @return {boolean} True if date is in the past, False if not
 */
function isInThePast(date) {
  let today = new Date().getTime();
  return today > date;  
}

/**
 * Gets the name of a file trimming the extension
 *
 * @param {string} name of the file with extension
 * @return {string}  name of the file without extension
 */
function getFileNameWithoutExtension(fileName) {
  let splits = fileName.split('.');
  let extension = splits[splits.length - 1];
  let file_name_no_extension = fileName.replace(`.${extension}`, '');
  
  return file_name_no_extension;
}