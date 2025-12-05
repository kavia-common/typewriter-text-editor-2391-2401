#!/bin/bash
cd /tmp/kavia/workspace/code-generation/typewriter-text-editor-2391-2401/frontend_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

