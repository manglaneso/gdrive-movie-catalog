/**
 * Gets a movie stored in the Active Spreadsheet as an Array
 *
 * @param {string} Google Drive ID of the file of the Movie to get
 * @return {Array} Array representing the movie to get. Null if not found
 */
function getMovie(id) {
  let sheet = SpreadsheetApp.getActive().getSheetByName('Movies');
  let range = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn());
    
  let values = range.getValues();
  
  for(let movie in values) {
    if(values[movie][12].indexOf(id) > -1) {
      return values[movie]
    }
  }
  
  return null;
}

/**
 * Removes row for the movie stored in the Active Spreadsheet
 *
 * @param {string} Google Drive ID of the file of the Movie to delete
 * @return {Void}
 */
function deleteMovie(id) {
  let sheet = SpreadsheetApp.getActive().getSheetByName('Movies');
  let range = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn());
  
  let values = range.getValues();
  
  for(let movie in values) {
    if(values[movie][12].indexOf(id) > -1) {
      console.log(`Borramos la peli ${values[movie[0]]}!`);
      sheet.deleteRow(parseInt(movie) + 1)
      break;
    }
  }
}

/**
 * Appends new row in the Active Spreadsheet representing a new Movie with TMDB metadata
 *
 * @param {string} Google Drive ID of the file of the Movie to add
 * @return {Void}
 */
function addMovie(id) {
  let sheet = SpreadsheetApp.getActive().getSheetByName('Movies');
  
  let file = DriveApp.getFileById(id);
  
  let file_url = file.getUrl();
  
  let fileName = file.getName();
  
  let fileNameWithoutExtension = getFileNameWithoutExtension(fileName);
  
  let toPush = Array(16).fill('');
  
  let searchResults = searchMovie(searchQuery=fileNameWithoutExtension);
      
  let results = searchResults['results'];
  // Logger.log(results)
  if(results.length > 0) {
    
    let bestSearchResult = getBestSearchResult(searchResults, fileNameWithoutExtension);
    
    toPush[0] = bestSearchResult['title'];
    toPush[10] = fileName;
    toPush[11] = bestSearchResult['id'];
    toPush[12] = file_url;
    
    let movieDetails = getMovieDetails(movieID=bestSearchResult['id']);
    
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
  
  console.log('Introducimos nueva peli!');
  console.log(JSON.stringify(toPush))
  console.log(toPush.length);
  sheet.appendRow(toPush);
  
}
