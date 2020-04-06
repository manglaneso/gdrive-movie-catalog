function getTMDBIDs() {
  let sheet = SpreadsheetApp.getActive().getSheetByName('carpeta_pelis');
  let range = sheet.getRange(3, 1, sheet.getLastRow() - 2, sheet.getLastColumn());
  
  let values = range.getValues();
  
  for(let i in values) {
    let title = values[i][10];
    Logger.log(values[i]);
    
    let searchResults = searchMovie(searchQuery=title);
    
    let results = searchResults['results'];
    
    if(results.length > 0) {
      values[i][11] = results[0]['id'];
      values[i][0] = results[0]['title'];
    }
    
  }
  
  
  
  range.setValues(values);
  
}

function getMoviesFromFolderToRename() {
  let sheet = SpreadsheetApp.getActive().getSheetByName('rename_files');
  
  let scriptProperties = PropertiesService.getScriptProperties();
  
  let carpetaPelisId = scriptProperties.getProperty('carpetaPelisId');
  
  let folder = DriveApp.getFolderById(carpetaPelisId);
  
  let toWrite = [];
  
  let files = folder.getFiles();
  
  
  while(files.hasNext()) {
    
    let file = files.next();
    
    let fileId = file.getId();
    
    let file_name = file.getName();
    let file_url = file.getUrl();
    
    let mime_type = file.getMimeType();
    
    let splits = file_name.split('.');
    
    let extension = splits[splits.length - 1];
    
    let file_name_no_extension = file_name.replace(`.${extension}`, '');
    
    if(mime_type.indexOf('video') > -1) {
      toWrite.push([file_name_no_extension, `.${extension}`, fileId]);
    }
  }
  
  let range = sheet.getRange(1, 1, toWrite.length, 3);
  range.setValues(toWrite);
  
}

function renameFiles() {
  let sheet = SpreadsheetApp.getActive().getSheetByName('rename_files');
  
  let range = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn());
  
  let values = range.getValues();
  
  for(let i in values) {
    let file = DriveApp.getFileById(values[i][2])
    file.setName(`${values[i][3]}${values[i][1]}`)
  }
  
}

function testThing() {
  let file = DriveApp.getFileById('1BMeRPtLuAgqc-BVC8NcCfQLvd0_auSVT');
  
  Logger.log(file.getMimeType())
  
}