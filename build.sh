#!/bin/bash
NODE=node
if [[ ${OSTYPE} =~ linux ]] ; then
  NODE=nodejs
fi

GRUNT="${NODE} ./node_modules/grunt-cli/bin/grunt"

${GRUNT} browserify
${GRUNT} watch


