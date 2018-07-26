#! /usr/bin/env sh

command="${1}"
shift

printUsage() {
  printf "./run <command>\\n\\n"
  echo   "where <command> is one of:"
  echo   "  lint"
  printf "  test\\n\\n"
}

writeEntry() {
  node ./build/write-entry/run
}

case "${command}" in
  test)
    node ./node_modules/.bin/mocha --ui tdd "$@" -- test.js ;;

  lint)
    npx eslint index.js test.js ;;

  '')
    printf "'run' requires a command\\n\\n"
    printUsage ;;

  *)
    printf "command '%s' not valid\\n\\n" "${command}"
    printUsage ;;
esac
