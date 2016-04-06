MAKE = gmake
ENCODING := UTF-8

PACKAGE = POKEMONS
VERSION = 0.1b
HOLDER = bergsrund@gmail.com
BUGSREPORT = bergsrund@gmail.com

PARS = INSTALLDIR=$(INSTALLDIR)/
CLOSUREDIR = /usr/local/bin/googleclosure

.PHONY : $(SUBDIRS)

ifeq ($(LANG), ru)
LOCALE := ru_RU
TARGETS := $(patsubst %.phtml, %_$(LANG).html, $(filter %.phtml,$(TEMPLATES))) $(patsubst %.php, %_$(LANG).cc, $(filter %.php,$(TEMPLATES))) $(patsubst %.pjs, %_$(LANG).js, $(filter %.pjs,$(TEMPLATES))) $(patsubst %.pcss, %_$(LANG).css, $(filter %.pcss,$(TEMPLATES)))
CTARGS := $(patsubst %.pjs, %_$(LANG).js, $(CONCATENATED))
CDEST := $(patsubst %.cjs, %_$(LANG).cjs, $(CONCATENATEDTO))
.PHONY : ru
ru : $(TARGETS) $(SUBDIRS) $(CDEST)
endif

ifeq ($(LANG), uk)
LOCALE := uk_UA
TARGETS := $(patsubst %.phtml, %_$(LANG).html, $(filter %.phtml,$(TEMPLATES))) $(patsubst %.php, %_$(LANG).cc, $(filter %.php,$(TEMPLATES))) $(patsubst %.pjs, %_$(LANG).js, $(filter %.pjs,$(TEMPLATES))) $(patsubst %.pcss, %_$(LANG).css, $(filter %.pcss,$(TEMPLATES)))
CTARGS := $(patsubst %.pjs, %_$(LANG).js, $(CONCATENATED))
CDEST := $(patsubst %.cjs, %_$(LANG).cjs, $(CONCATENATEDTO))

.PHONY : uk
uk : $(TARGETS) $(SUBDIRS) $(CDEST)
endif

ifeq ($(LANG), en)
LOCALE := en_US
TARGETS := $(patsubst %.phtml, %_$(LANG).html, $(filter %.phtml,$(TEMPLATES))) $(patsubst %.php, %_$(LANG).cc, $(filter %.php,$(TEMPLATES))) $(patsubst %.pjs, %_$(LANG).js, $(filter %.pjs,$(TEMPLATES))) $(patsubst %.pcss, %_$(LANG).css, $(filter %.pcss,$(TEMPLATES)))
CTARGS := $(patsubst %.pjs, %_$(LANG).js, $(CONCATENATED))
CDEST := $(patsubst %.cjs, %_$(LANG).cjs, $(CONCATENATEDTO))
.PHONY : en
en : $(TARGETS) $(SUBDIRS) $(CDEST)
endif

LOCALE_DIR = locale/$(LANG)/LC_MESSAGES
VPATH = locale/$(LANG)/LC_MESSAGES

%.pot : %.pcss
	sh -c "if [ ! -d $(LOCALE_DIR) ]; then mkdir -p $(LOCALE_DIR); fi"
	/usr/local/bin/xgettext -L PHP -o $(LOCALE_DIR)/$@ \
--from-code=utf-8 \
--copyright-holder=$(HOLDER) \
--package-name=$(PACKAGE) \
--package-version=$(VERSION) \
--msgid-bugs-address=$(BUGSREPORT) \
$<

%.pot : %.phtml
	sh -c "if [ ! -d $(LOCALE_DIR) ]; then mkdir -p $(LOCALE_DIR); fi"
	/usr/local/bin/xgettext -L PHP -o $(LOCALE_DIR)/$@ \
--from-code=utf-8 \
--copyright-holder=$(HOLDER) \
--package-name=$(PACKAGE) \
--package-version=$(VERSION) \
--msgid-bugs-address=$(BUGSREPORT) \
$<

%.pot : %.php
	sh -c "if [ ! -d $(LOCALE_DIR) ]; then mkdir -p $(LOCALE_DIR); fi"
	/usr/local/bin/xgettext -L PHP -o $(LOCALE_DIR)/$@ \
--from-code=utf-8 \
--copyright-holder=$(HOLDER) \
--package-name=$(PACKAGE) \
--package-version=$(VERSION) \
--msgid-bugs-address=$(BUGSREPORT) \
$<

%.pot : %.pjs
	sh -c "if [ ! -d $(LOCALE_DIR) ]; then mkdir -p $(LOCALE_DIR); fi"
	/usr/local/bin/xgettext -L PHP -o $(LOCALE_DIR)/$@ \
--from-code=utf-8 \
--copyright-holder=$(HOLDER) \
--package-name=$(PACKAGE) \
--package-version=$(VERSION) \
--msgid-bugs-address=$(BUGSREPORT) \
$<

%.po : %.pot
	sh -c "if [ ! -f $(LOCALE_DIR)/$@ ]; then cp $(LOCALE_DIR)/$(patsubst %.po,%.pot,$@)  $(LOCALE_DIR)/$@; fi"
	msgmerge -o $(LOCALE_DIR)/$@ $(LOCALE_DIR)/$@ $(LOCALE_DIR)/$(patsubst %.po,%.pot,$@)

%.mo : %.po
	msgfmt -c -o $(LOCALE_DIR)/$@ $(LOCALE_DIR)/$(patsubst %.mo,%.po,$@)

$(filter %.html,$(TARGETS)) : %_$(LANG).html : %.mo
	php $(patsubst %_$(LANG).html,%.phtml,$@) $(LOCALE) $(ENCODING) > $@

$(filter %.cc,$(TARGETS)) : %_$(LANG).cc : %.mo
	php $(patsubst %_$(LANG).cc,%.php,$@) $(LOCALE) $(ENCODING) > $@

$(filter %.js,$(TARGETS)) : %_$(LANG).js : %.mo
	php $(patsubst %_$(LANG).js,%.pjs,$@) $(LOCALE) $(ENCODING) > $@

$(filter %.css,$(TARGETS)) : %_$(LANG).css : %.mo
	php $(patsubst %_$(LANG).css,%.pcss,$@) $(LOCALE) $(ENCODING) > $@


$(SUBDIRS) :
	$(MAKE) -C $@ -I ./:$(MASTERDIR) LANG=$(LANG) $(PARS)$@ $(TARG)

.PHONY : $(CDEST)

$(CDEST) :	
	rm -fr $(CDEST)
	for f in $(CTARGS); do cat $$f >> $(CDEST); done;


#	rm -fr $(CDEST).cat
#	for f in $(CTARGS); do cat $$f >> $(CDEST).cat; done;
#	java -jar $(CLOSUREDIR)/compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --language_in ECMASCRIPT5 --js $(CDEST).cat --js_output_file $(CDEST)


clean : TARG = clean
ifdef TARGETS
.PHONY : clean
clean : $(SUBDIRS) 
	rm -fr $(TARGETS) $(CDEST)
endif

TMPL = $(INSTALLED)

ifeq ($(TARG), install) 
.PHONY : install $(TMPL) 
install : $(TMPL) $(SUBDIRS)
$(TMPL) : 
	cp $(filter %.json,$@)  $(filter %.js,$@) $(patsubst %.phtml, %_$(LANG).html, $(filter %.phtml,$@)) $(patsubst %.php, %_$(LANG).cc, $(filter %.php,$@)) $(patsubst %.pjs, %_$(LANG).js, $(filter %.pjs,$@)) $(patsubst %.cjs, %_$(LANG).cjs, $(filter %.cjs,$@)) $(patsubst %.pcss, %_$(LANG).css, $(filter %.pcss,$@))    $(patsubst %.phtml, $(INSTALLDIR)/%.html, $(filter %.phtml,$@)) $(patsubst %.php, $(INSTALLDIR)/%.cc, $(filter %.php,$@)) $(patsubst %.js, $(INSTALLDIR)/%.js, $(filter %.js,$@)) $(patsubst %.json, $(INSTALLDIR)/%.json, $(filter %.json,$@))  $(patsubst %.pjs, $(INSTALLDIR)/%.js, $(filter %.pjs,$@)) $(patsubst %.pcss, $(INSTALLDIR)/%.css, $(filter %.pcss,$@)) $(patsubst %.cjs, $(INSTALLDIR)/%.js, $(filter %.cjs,$@)) 
	
endif
