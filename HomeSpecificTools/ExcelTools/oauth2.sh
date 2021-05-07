#!/bin/sh

CLIENT_ID="905622295615-m10jpdd3bp72f1b7qtoek2bbv4j76t9u.apps.googleusercontent.com"
CLIENT_SECRET="vfLHorysXZehKJIssD79ZKxh"
REDIRECT_URL="urn:ietf:wg:oauth:2.0:oob"


node Js/get_oauth2_permissions.js ${CLIENT_ID} ${CLIENT_SECRET} ${REDIRECT_URL}
 
# pause
