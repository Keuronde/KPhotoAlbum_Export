SRCDIR=WebSite_ressources
WEBFILE=index.html mustache.js  style_js.css  tagGallery.js
RUNFILE=index.html
WEBDEMO=Live_Demo


COPY_FILES := $(patsubst $(SRCDIR)/%,$(WEBDEMO)/%,$(wildcard $(SRCDIR)/*))

all: $(COPY_FILES)

run: all
	xdg-open $(WEBDEMO)/$(RUNFILE)

$(WEBDEMO)/%: $(SRCDIR)/%
	cp -f $< $@


