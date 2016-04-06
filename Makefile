MAKE = gmake
LANGS = ru en uk
export MASTERDIR = /var/projects/pokemons/trunk
SRCDIR = $(MASTERDIR)/src
INSTALLDIR = /var/projects/pokemons/www
OWNER = pokemon
GROUP = www
export TARG = 

.PHONY: $(LANGS)

all : $(LANGS)
	
$(LANGS) :
	$(MAKE) -C $(SRCDIR) -I ./:$(MASTERDIR) LANG=$@ $(PARS)$@ $(TARG)

clean : TARG = clean
clean : PARS = INSTALLDIR=$(INSTALLDIR)/
.PHONY : clean
clean : $(LANGS)


INSTALLLANGDIRS = $(patsubst %,$(INSTALLDIR)/%,$(LANGS))

install : TARG = install
install : PARS = INSTALLDIR=$(INSTALLDIR)/
.PHONY : install
install : $(INSTALLLANGDIRS) $(LANGS) postinstall


$(INSTALLLANGDIRS) : maketree
	mkdir -p $@
	mtree -p $@/ -f pokemons.mtree -U -d
	mtree -p $@ -f pokemons.mtree | sed 's/missing//' > /tmp/srctree.tmp
	for file in `cat /tmp/srctree.tmp | tr '\n' ' '`; do cp $(SRCDIR)/$$file $@/$$file; done

.PHONY : maketree
maketree : 
	/usr/sbin/mtree -c -n -p ./src -k gname,mode,uname -X exclude-list | sed 's/uname=[^[:space:]]*[[:space:]]*gname=[^[:space:]]*/uname=$(OWNER) gname=$(GROUP)/' > pokemons.mtree

.PHONY : postinstall
postinstall :
	chown -R $(OWNER):$(GROUP) $(INSTALLDIR)

.PHONY : deinstall
deinstall :
	rm -fr $(INSTALLDIR)

.PHONY: reinstall
reinstall : deinstall install 
