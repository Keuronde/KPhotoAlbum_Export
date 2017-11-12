var criteria = [];

// Function to get unique value in a array
function unique(a) {
  return a.sort().filter(function(value, index, array) {
    return (index === 0) || (value !== array[index-1]);
  });
}

function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) {
            return i;
        }
    }
    return -1;
}

// Function to intersect array
function intersect_photos(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        return arrayObjectIndexOf(b,e.file,"file") > -1;
    });
}

function getTags(photosDatabase, tagFamily){
  /* This function return a list of tags
  Inputs:
  * photosDatabase: database
  * tagFamily: tag family wanted */
  var nbTag = 0;
  var myTags = [];
  var i;
  for (i = 0; i < photosDatabase.Categories.length; i++) {
    if (photosDatabase.Categories[i].category == tagFamily){
      myTags[nbTag] = photosDatabase.Categories[i].value
      nbTag++;
    }
  }
  return myTags;
}

function getTagFamilies(photosDatabase){
  /* this function return the list of tag family
  Inputs:
  * photosDatabase: database */
  myTagFamilies = [];
  for (i = 0; i < photosDatabase.Categories.length; i++) {
    myTagFamilies.push(photosDatabase.Categories[i].category)
  }
  myTagFamilies = unique(myTagFamilies);
  return myTagFamilies;
}

function getPhotos(photosDatabase,criteria){
  /* Return the list of photos corresponding to all given criteria
  Inputs:
  * photosDatabase: database
  * criteria: array of contidions like this [{"category":"cat1","value":"val1"}, {"category":"cat2","value":"val2"}]
  */
  var i;
  var selectedPhotos=[]
  if (criteria.length == 0){
    for (i=0; i<photosDatabase.Images_data.length; i++){
      selectedPhotos.push({"file":photosDatabase.Images_data[i].file});
    }
    return selectedPhotos;
  }
  var first=true;

  for (crit=0; crit<criteria.length; crit++){
    // for each given criteria, find corresponding photos
    var photoForThisCriteria=[];
    for(i=0; i<photosDatabase.Relations.length; i++){
      if(photosDatabase.Relations[i].category == criteria[crit].category &&
         photosDatabase.Relations[i].value == criteria[crit].value){
        
        photoForThisCriteria.push({"file":photosDatabase.Relations[i].file});
      }
      
    }

    // then get the intersection of each result
    if (first == true){
      selectedPhotos = photoForThisCriteria;
      first=false;
    }else{
      selectedPhotos = intersect_photos(selectedPhotos, photoForThisCriteria);
    }
    
  }
  return selectedPhotos;
}
