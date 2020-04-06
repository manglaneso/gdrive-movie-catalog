/**
 * WebApp endpoint to handle Push Notifications for Google Drive changes
 *
 * @param {object} POST request event object
 * @return {string} Result of the Push Notification handling
 */
function doPost(e) {
  // New Change!
  
  console.log(JSON.stringify(e));
    
  let scriptProperties = PropertiesService.getScriptProperties();
  
  let requestParameters = e['parameter'];
    
  let carpetaPelisId = scriptProperties.getProperty('carpetaPelisId');
  
  if(requestParameters['webhook_id']) {
    
    if(requestParameters['webhook_id'] == scriptProperties.getProperty('webhookId')) {
      let newChanges = listChanges()['changes'];
      
      for(let i in newChanges) {
        
        let fileId = newChanges[i]['fileId'];
        
        if(newChanges[i]['removed']) {
          // Se ha borrado un archivo, comprobamos si está en la hoja
          let movie = getMovie(fileId)
          if(movie) {
            // Está en la hoja, lo borramos
            deleteMovie(fileId)
          }          
        } else {
          if(newChanges[i]['changeType'] == 'file') {
            // Es un archivo de video. NOS INTERESA
            
            let file = DriveApp.getFileById(fileId);
            
            let parents = file.getParents();
            
            while(parents.hasNext()) {
              let parent = parents.next();
              
              if(parent.getId() == carpetaPelisId) {
                // Es un video de la carpeta de pelis. NOS INTERESA
                Logger.log(fileId)
                let movie = getMovie(fileId)
                
                if(!movie) {
                  addMovie(fileId)
                }
                
                break;
              } 
            }
          }
        }
        
      }  
      
      return ContentService.createTextOutput('OK');
      
    } else {
       return ContentService.createTextOutput('NOT AUTHORIZED');
    }
    
  } else {
    return ContentService.createTextOutput('NOT AUTHORIZED');  
  }  
}
