#! /bin/sh

if [ -e ./WMCremote.wgt ]; then 
    rm -v WMCremote.wgt
fi

# Zip all the html, javascript, CSS, images and other information.
zip -r WMCremote.wgt *.html ./js/*.js ./css/* ./fonts/* ./img/* config.xml webinos.png -x *~ -x */*~


