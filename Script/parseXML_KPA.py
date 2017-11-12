# -*- coding: utf-8 -*-
#import library to do http requests:
import urllib2
import codecs
 
#import easy to use xml parser called minidom:
from xml.dom.minidom import parseString
#all these imports are standard on most modern python implementations
 
#download the file:
file = open('index.xml')
#convert to string:
data = file.read()
#close file because we dont need it anymore:
file.close()
#parse the xml you downloaded
dom = parseString(data)

chaineSQL = "";
chaineJSON = "var photosDatabase = {";


# Créer la liste des catégories
categoryList = {}
for cat in dom.getElementsByTagName("option"):
  cat_name = cat.attributes['name'].value
#  print cat_name
  values = cat.getElementsByTagName("value")
  for value in values:
    value_name = value.attributes['value'].value 
#    print ' ' + value_name
    try:
      categoryList[cat_name].add(value_name)
    except KeyError:
      categoryList[cat_name] = set()
      categoryList[cat_name].add(value_name)

# Génération du code SQL + JSON
# Créer une table Catégories
# avec deux champs : catégorie et valeur
chaineJSON = chaineJSON + """"Categories":["""
chaineSQL = chaineSQL + """DROP TABLE IF EXISTS `Categories`;\n"""
chaineSQL = chaineSQL + """CREATE TABLE IF NOT EXISTS `Categories` (
  `categorie` text NOT NULL,
  `value` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;\n"""
print categoryList
chaineSQL = chaineSQL + "INSERT INTO `Categories` (`categorie`, `value`) VALUES\n"
for category in categoryList:
  for value in categoryList[category]:
    chaineSQL = chaineSQL + """ ("%s", "%s"),\n""" % (category, value)
    chaineJSON = chaineJSON + """{"category":"%s","value":"%s"},\n""" % (category, value)
chaineSQL = chaineSQL[:-2] # on enlève la dernière virgule
chaineSQL = chaineSQL + ";\n\n\n" # on la remplace par un point virgule
chaineJSON = chaineJSON[:-2] # on enlève la dernière virgule
chaineJSON = chaineJSON + "]" # on ferme le tableau

# Créer une table images_data avec plein d'information
chaineSQL = chaineSQL + """DROP TABLE IF EXISTS `Images_data`;\n"""
chaineSQL = chaineSQL + """CREATE TABLE IF NOT EXISTS `Images_data` (
  `md5sum` text NOT NULL,
  `fichier` text NOT NULL,
  `date` datetime NOT NULL,
  `height` int NOT NULL,
  `width` int NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;\n"""

# Insérer les relation et leurs valeurs
chaineSQL = chaineSQL + """INSERT INTO `Images_data` (`md5sum`, `fichier`, `date`, `height`, `width`) VALUES\n"""
chaineJSON = chaineJSON + """,\n"Images_data":["""

for image in dom.getElementsByTagName("image"):
  md5sum_name = image.attributes['md5sum'].value
  file_name = image.attributes['file'].value
#  date_name = image.attributes['startDate'].value
  date_name = image.attributes['yearFrom'].value + "-" + image.attributes['monthFrom'].value + "-" + image.attributes['dayFrom'].value + \
    " " + image.attributes['hourFrom'].value + ":" + image.attributes['minuteFrom'].value + ":" + image.attributes['secondFrom'].value
  height_name = image.attributes['height'].value
  width_name = image.attributes['width'].value
#  print md5sum_name + ' ' + file_name
  chaineSQL = chaineSQL + """ ("%s", "%s", "%s", "%s", "%s"),\n""" % (md5sum_name, file_name, date_name, height_name, width_name)
  chaineJSON = chaineJSON + """ {"md5sum":"%s","file":"%s","date":"%s","height":"%s", "width":"%s"},\n""" % \
                                 (md5sum_name, file_name, date_name, height_name, width_name)

chaineSQL = chaineSQL[:-2] # on enlève la dernière virgule
chaineSQL = chaineSQL + ";\n\n\n" # on la remplace par un point virgule
chaineJSON = chaineJSON[:-2] # on enlève la dernière virgule
chaineJSON = chaineJSON + "]" # on ferme le tableau


# Créer une table relation avec md5sum, fichier, clé, valeur
chaineJSON = chaineJSON + """,\n"Relations":["""
chaineSQL = chaineSQL + """DROP TABLE IF EXISTS `Relations`;\n"""
chaineSQL = chaineSQL + """CREATE TABLE IF NOT EXISTS `Relations` (
  `md5sum` text NOT NULL,
  `fichier` text NOT NULL,
  `categorie` text NOT NULL,
  `valeur` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;\n"""
# Insérer les relation et leurs valeurs
chaineSQL = chaineSQL + """INSERT INTO `Relations` (`md5sum`, `fichier`, `categorie`, `valeur`) VALUES\n"""
for image in dom.getElementsByTagName("image"):
  md5sum_name = image.attributes['md5sum'].value
  file_name = image.attributes['file'].value
#  print md5sum_name + ' ' + file_name
  # print 'Taille = ' + image.attributes['width'].value + 'x' + image.attributes['height'].value
  for tags in image.getElementsByTagName("option"):
    for cle in tags.getElementsByTagName("value"):
      tag_name = tags.attributes['name'].value
      cle_name = cle.attributes['value'].value
      # print tag_name + ' => ' + cle_name
      chaineSQL = chaineSQL + """ ("%s", "%s", "%s", "%s"),\n""" % (md5sum_name, file_name, tag_name, cle_name)
      chaineJSON = chaineJSON + """ {"md5sum":"%s","file":"%s","category":"%s","value":"%s"},\n""" % \
                                 (md5sum_name, file_name, tag_name, cle_name)

chaineSQL = chaineSQL[:-2] # on enlève la dernière virgule
chaineSQL = chaineSQL + ";\n\n\n" # on la remplace par un point virgule
chaineJSON = chaineJSON[:-2] # on enlève la dernière virgule
chaineJSON = chaineJSON + "]" # on ferme le tableau

#On finit les chaines de caractère
chaineJSON = chaineJSON + "}" # on ferme le tableau

# on ouvre le fichier de BDD
fichierSql = codecs.open("photos.sql",'w', 'utf-8')
fichierSql.write(chaineSQL)
fichierSql.close()

fichierJSON = codecs.open("photos.js",'w', 'utf-8')
fichierJSON.write(chaineJSON)
fichierJSON.close()

def creerTable(chaineSQL, tableName, colonnes):
  # Entête de la table
  chaineSQL = chaineSQL + 'CREATE TABLE IF NOT EXISTS `%s` (\n' % tableName
  # liste des colonnes
  for colonne in colonnes:
    chaineSQL = chaineSQL + '`%s` text NOT NULL,' % colonne
  chaineSQL = chaineSQL[:-1]
  # fin de la table
  chaineSQL = chaineSQL + ') ENGINE=MyISAM DEFAULT CHARSET=utf8;'


