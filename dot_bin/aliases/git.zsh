alias gchanges='git ls-files --modified --exclude-standard'
alias gignored='git ls-files --cached --ignored --exclude-standard -z | xargs -0 git rm --cached'
alias guntracked='git ls-files . --exclude-standard --others'
alias repo-info='onefetch --no-art --no-color-palette || true && tokei || true && scc || true'
