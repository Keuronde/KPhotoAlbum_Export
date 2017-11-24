SRCDIR=WebSite_ressources
WEBFILE=index.html mustache.js  style_js.css  tagGallery.js
WEBDEMO=Live_Demo


COPY_FILES := $(patsubst $(SRCDIR)/%,$(WEBDEMO)/%,$(wildcard $(SRCDIR)/*))

all: $(COPY_FILES)


$(WEBDEMO)/%: $(SRCDIR)/%
	cp -f $< $@


