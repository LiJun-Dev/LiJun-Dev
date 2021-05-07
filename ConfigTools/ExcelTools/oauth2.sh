#!/bin/sh

CLIENT_ID="113423727760-n7v4l8ksavcc9b5ho0d8md72bk1k9nhh.apps.googleusercontent.com"
CLIENT_SECRET="bv2_8np9gZJQ8F2AVFU2Em1t"
REDIRECT_URL="urn:ietf:wg:oauth:2.0:oob"


node get_oauth2_permissions.js ${CLIENT_ID} ${CLIENT_SECRET} ${REDIRECT_URL}
 
# pause