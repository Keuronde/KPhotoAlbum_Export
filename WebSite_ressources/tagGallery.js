var criteria = {"currentSearch":[]};
/* Should look like this
"currentSearch":
  [
    {
      "category":categorie1,
      "values":[value1, value2],
      "boolOp":AND
    },
    {
      "categorie":categorie2,
      "values":[value1, value2],
      "boolOp":AND
    }


*/

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
function tg_reset(){
  criteria = {"currentSearch":[]};
}
function tg_delCriteria(myCrit){
  /* This function remove a criterion from the Criteria variable.
  Inputs:
  * myCrit = {"category":xxx, "value":xxx}
  */
  
  
	myIndex = criteria.indexOf(myCrit);
  criteria.splice(myIndex,1);
}

function tg_addCriteria(myCrit){
  /* This function add a criterion from the Criteria variable.
  Inputs:
  * myCrit = {"category":xxx, "value":xxx}
  */
  // Search if the category exists
  var cat;
  var categoryIsPresent=false;
  for (cat=0; cat<criteria.currentSearch.length; cat++){
    if(criteria.currentSearch[cat].category == myCrit.category){
      // If the category is found, add the value
      criteria.currentSearch[cat].values.push(myCrit.value)
      categoryIsPresent=true
    }
  }
  
  // If the category is not found, ad it with the value
  if (categoryIsPresent==false){
    criteria.currentSearch.push({
      "category":myCrit.category,
      "values":[myCrit.value],
      "boolOp":"AND"
    });
  }
  
//  criteria.push(myCrit)
}

function tg_getTags(photosDatabase, tagFamily){
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

function tg_getTagFamilies(photosDatabase){
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

function tg_getPhotos(photosDatabase,criteria){
  /* Return the list of photos corresponding to all given criteria
  Inputs:
  * photosDatabase: database
  * criteria: array of contidions like this [{"category":"cat1","value":"val1"}, {"category":"cat2","value":"val2"}]
  */
  var i;
  var selectedPhotos=[]
  if (criteria.currentSearch.length == 0){
    for (i=0; i<photosDatabase.Images_data.length; i++){
      selectedPhotos.push({"file":photosDatabase.Images_data[i].file});
    }
    return selectedPhotos;
  }
  var first=true;

  for (crit=0; crit<criteria.currentSearch.length; crit++){
    // for each given criteria, find corresponding photos
    var photoForThisCriteria=[];
    for(i=0; i<photosDatabase.Relations.length; i++){
      // TODO : loop also on values
      if(photosDatabase.Relations[i].category == criteria.currentSearch[crit].category &&
         photosDatabase.Relations[i].value == criteria.currentSearch[crit].value){
        
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
