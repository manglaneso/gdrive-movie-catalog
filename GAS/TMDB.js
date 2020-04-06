const baseUrl = 'https://api.themoviedb.org/';
const version = '3';

const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const imdbBaseUrl = 'https://www.imdb.com/title/';
const tmdbBaseUrl = 'https://www.themoviedb.org/movie/';

/**
 * Search for a movie by title
 *
 * @param {string} name of the 
 * @return {object} TMDB search result resource
 */
function searchMovie(searchQuery='The Big Lebowski') {
  
  let scriptProperties = PropertiesService.getScriptProperties();
  
  let apiKey = scriptProperties.getProperty('tmdbApiKey');
  
  let url = `${baseUrl}${version}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}&include_adult=true&language=es_ES`
  
  let options = {
    method: 'GET',
    muteHttpExceptions: false,
  };

  let res = UrlFetchApp.fetch(url, options);
  
  return JSON.parse(res.getContentText());
  
}

/**
 * Get the details of a movie by ID
 *
 * @param {number} ID of the movie to get
 * @return {object} TMDB Movie result resource
 */
function getMovieDetails(movieID=62) {
  let scriptProperties = PropertiesService.getScriptProperties();
  
  let apiKey = scriptProperties.getProperty('tmdbApiKey');
  
  let url = `${baseUrl}${version}/movie/${movieID}?api_key=${apiKey}&language=es_ES&append_to_response=credits`
  
  let options = {
    method: 'GET',
    muteHttpExceptions: false,
  };

  let res = UrlFetchApp.fetch(url, options);
    
  return JSON.parse(res.getContentText());
}

/**
 * Get the first ten cast members of a movie as a comma separated string
 *
 * @param {object} TMDB Movie result resource
 * @return {string} Comma separated string of the first ten cast members
 */
function getMovieCast(movieObject) {
  
  let i = 0;
  let ret = '';
  
  let cast = movieObject['credits']['cast']
  
  for(let elem in cast) {
    if(i < 9) {
      ret += `${cast[elem]['name']}, `;
    } else if(i == 9) {
      ret += cast[elem]['name'];
    } else {
      break;
    }
    i++;
  }
  
  return ret;
  
}

/**
 * Get the director of a movie
 *
 * @param {object} TMDB Movie result resource
 * @return {string} Name of the movie director
 */
function getMovieDirector(movieObject) { 
  let crew = movieObject['credits']['crew']
  
  for(let elem in crew) {
    if(crew[elem]['job'] == 'Director')
      return crew[elem]['name'];
  }  
}

/**
 * Get the "best" search result of a TMDB search result resource. 
 * If the title of the search object is the same as the fileName, returns that search object.
 * If not, return the first result.
 *
 * @param {object} TMDB Search results resource
 * @param {string} file name of the movie file
 * @return {object} Best result.
 */
function getBestSearchResult(searchResults, fileName) {
  let results = searchResults['results'];
  
  for(let result in results) {
    if(results[result]['title'].toLowerCase() == fileName.toLowerCase()) {
      return results[result];
    }
  }
  
  return results[0];
  
}