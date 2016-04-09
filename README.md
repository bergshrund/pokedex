# pokedex

Simple pokeapi.io client.
See a working version on [http://pokemons.data-1.net](http://pokemons.data-1.net)

### Current Version : v0.0.2a

## Prerequisites and other notes

The following programs and/or packages are required: 

* NGINX HTTP server, version 1.0.14 or later
* GNU Make version 3.82 or later
* GNU Gettext version 0.18.1 or later
* php CLI version 5.3 or later for gettext preprocessing
* php-gettext extention module

## Supported Browsers:
Chrome 49+, Firefox 45.0.1+, Opera 12.17+

## Installation Instructions for Pokedex
Once you have obtained the files from Git repository , "cd" to the "pokedex" directory.
The Makefile and various source files are stored there. 
By default, gmake will search and process source files in "/var/projects/pokemons/trunk". You should specify a directory name other 
than "/var/projects/pokemons/trunk" by changing variable MASTERDIR in Makefile to your actual working directory.

In the directory that the Makefile is in, type "./gmake" to build the site:

     $ cd pokedex
     $ ./gmake; gmake reinstall

### Make file setup
By default, gmake will install source files in "/var/projects/pokemons/www". You can specify a directory name other 
than "/var/projects/pokemons/www" by typing your preferable value into INSTALLDIR variable in Makefile.

### NGINX virtual host configuration example

    server {
        listen       192.168.0.1:80;
        server_name  pokemons.foo.com;

        access_log   /var/www/pokemon/logs/pokemon.access.log;
        error_log    /var/www/pokemon/logs/pokemon.error.log info;
        rewrite_log  on;

        location / {

            if ($http_accept_language !~* "^uk|^ru") {
               rewrite ^/$ /en break;
             }

            if ($http_accept_language ~* "^uk") {
               rewrite ^/$ /uk break;
             }

            if ($http_accept_language ~* "^ru") {
               rewrite ^/$ /ru break;
             }

            root /var/www/pokemon/pokemons.foo.com;
            index index.html;
        }

        location = /favicon.ico {
            alias /var/www/pokemon/favicon.ico;
            log_not_found off;
            access_log off;
        }

        location = /robots.txt {
            allow all;
            log_not_found off;
            access_log off;
        }

        error_page   403              /403.html;
        error_page   404              /404.html;
        error_page   500 502 503 504  /50x.html;
       }



