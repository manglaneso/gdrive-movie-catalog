// Add a custom menu to the active spreadsheet, including a separator and a sub-menu.
function onOpen(e) {
  SpreadsheetApp.getUi()
      .createMenu('Generador de metadatos')
      .addItem('Actualizar nuevos', 'getMoviesFromFolder')
      .addItem('Actualizar todos', 'forceGetMoviesFromFolder')
      .addToUi();
}


function getMoviesFromFolder() {
  let sheet = SpreadsheetApp.getActive().getSheetByName('Movies');
  
  let currentRange = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn());
  let currentValues = currentRange.getValues();
  
  let scriptProperties = PropertiesService.getScriptProperties();
  
  let carpetaPelisId = scriptProperties.getProperty('carpetaPelisId');
  
  let folder = DriveApp.getFolderById(carpetaPelisId);
  
  let toWrite = [];
  
  let files = folder.getFiles();
  
  let index = 0;
  
  while(files.hasNext()) {
    
    let file = files.next();
    
    let fileName = file.getName();
    let fileUrl = file.getUrl();
    
    let mimeType = file.getMimeType();
    
    let splits = fileName.split('.');
    
    let extension = splits[splits.length - 1];
    
    let fileNameNoExtension = fileName.replace(`.${extension}`, '');
    
    if(mimeType.indexOf('video') > -1) {
      let toPush = Array(16).fill('');
      
      let searchResults = searchMovie(searchQuery=fileNameNoExtension);
      
      let results = searchResults['results'];
      // Logger.log(results)
      if(results.length > 0) {
        
        let bestSearchResult = getBestSearchResult(searchResults, fileNameNoExtension);
        
        console.log(currentValues[index]);
        
        if(bestSearchResult['title'] == currentValues[index][0]) {
          toPush = currentValues[index];
          toPush[12] = fileUrl;
        } else {
          toPush[0] = bestSearchResult['title'];
          toPush[10] = fileName;
          toPush[11] = bestSearchResult['id'];
          toPush[12] = fileUrl;
          
          let movieDetails = JSON.parse(getMovieDetails(movieID=bestSearchResult['id']));
          
          if(movieDetails['release_date']) {
            toPush[1] = movieDetails['release_date'];
          }
          
          if(movieDetails['poster_path']) {
            toPush[3] = `${imageBaseUrl}${movieDetails['poster_path']}`;
          }
          
          if(movieDetails['overview']) {
            toPush[2] = movieDetails['overview'];
          }
          
          if(movieDetails['belongs_to_collection']) {
            toPush[4] = movieDetails['belongs_to_collection']['name'];
          }
          
          if(movieDetails['credits']) {
            if(movieDetails['credits']['cast']) {
              toPush[5] = getMovieCast(movieDetails);
            }
            
            if(movieDetails['credits']['crew']) {
              toPush[6] = getMovieDirector(movieDetails);
            }
          }
          
          if(movieDetails['vote_average']) {
            toPush[7] = movieDetails['vote_average'];
          }
          
          if(movieDetails['id']) {
            toPush[13] = `${tmdbBaseUrl}${movieDetails['id']}`;
          }
          
          if(movieDetails['homepage']) {
            toPush[14] = movieDetails['homepage'];
          }
          
          if(movieDetails['imdb_id']) {
            toPush[15] = `${imdbBaseUrl}${movieDetails['imdb_id']}`;
          }
        }
        
      }
      console.log(JSON.stringify(toPush))
      console.log(toPush.length);
      toWrite.push(toPush);
      index += 1;
    }
  }
  
  let range = sheet.getRange(3, 1, toWrite.length, toWrite[0].length);
  range.setValues(toWrite);
  
}

function forceGetMoviesFromFolder() {
  let sheet = SpreadsheetApp.getActive().getSheetByName('Movies');
  
  let scriptProperties = PropertiesService.getScriptProperties();
  
  let carpetaPelisId = scriptProperties.getProperty('carpetaPelisId');
  
  let folder = DriveApp.getFolderById(carpetaPelisId);
  
  let toWrite = [];
  
  let files = folder.getFiles();
  
  let index = 0;
  
  while(files.hasNext()) {
    
    let file = files.next();
    
    let fileName = file.getName();
    let fileUrl = file.getUrl();
    
    let mimeType = file.getMimeType();
    
    let splits = fileName.split('.');
    
    let extension = splits[splits.length - 1];
    
    let fileNameNoExtension = fileName.replace(`.${extension}`, '');
    
    if(mimeType.indexOf('video') > -1) {
      let toPush = Array(16).fill('');
      
      let searchResults = searchMovie(searchQuery=fileNameNoExtension);
      
      let results = searchResults['results'];
      // Logger.log(results)
      if(results.length > 0) {
        
        let bestSearchResult = getBestSearchResult(searchResults, fileNameNoExtension);
        
          toPush[0] = bestSearchResult['title'];
          toPush[10] = fileName;
          toPush[11] = bestSearchResult['id'];
          toPush[12] = fileUrl;
          
          let movieDetails = JSON.parse(getMovieDetails(movieID=bestSearchResult['id']));
          
          if(movieDetails['release_date']) {
            toPush[1] = movieDetails['release_date'];
          }
          
          if(movieDetails['poster_path']) {
            toPush[3] = `${imageBaseUrl}${movieDetails['poster_path']}`;
          }
          
          if(movieDetails['overview']) {
            toPush[2] = movieDetails['overview'];
          }
          
          if(movieDetails['belongs_to_collection']) {
            toPush[4] = movieDetails['belongs_to_collection']['name'];
          }
          
          if(movieDetails['credits']) {
            if(movieDetails['credits']['cast']) {
              toPush[5] = getMovieCast(movieDetails);
            }
            
            if(movieDetails['credits']['crew']) {
              toPush[6] = getMovieDirector(movieDetails);
            }
          }
          
          if(movieDetails['vote_average']) {
            toPush[7] = movieDetails['vote_average'];
          }
          
          if(movieDetails['id']) {
            toPush[13] = `${tmdbBaseUrl}${movieDetails['id']}`;
          }
          
          if(movieDetails['homepage']) {
            toPush[14] = movieDetails['homepage'];
          }
          
          if(movieDetails['imdb_id']) {
            toPush[15] = `${imdbBaseUrl}${movieDetails['imdb_id']}`;
          }
        
      }
      console.log(JSON.stringify(toPush))
      console.log(toPush.length);
      toWrite.push(toPush);
    }
    index += 1;
  }
  
  let range = sheet.getRange(3, 1, toWrite.length, toWrite[0].length);
  range.setValues(toWrite);
  
}