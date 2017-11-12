# KPhotoAlbum_Export

## Usage
Here are the step to produce the export.

1.    Put in the same directory the index.xml from KPhotoAlbum and the script parseXML_KPA.py
1.    Run python parseXML_KPA.py, It will produce a file named: photos.js
1.    Copy your photos in a /mini folder and resize them to have a heigth of 150 px
1.    Now, organize your files this way:


..*In your root folder : tagGallery.js, index.html, style_js.css, mustache.js, photos.js (the file you produced), and a folder named "Photos"

..* In your "Photos" folder : your photos in a correct web size and a folder named "mini"

..* In your folder named "mini" : your tiny photos, heigth 150px.

## Live Demo
I have put here a [live demo](http://poivron-robotique.fr/Demo_KPA_export/)

## Based on
This project is using Mustache.js under 
The MIT License

Copyright (c) 2009 Chris Wanstrath (Ruby)
Copyright (c) 2010-2014 Jan Lehnardt (JavaScript)
Copyright (c) 2010-2015 The mustache.js community


