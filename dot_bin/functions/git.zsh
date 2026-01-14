www() {
  url=$(git remote -v | grep '(fetch)' | awk '{print $2}' | sed -E 's|^git@([^:]+):(.*)\.git$|https://\1/\2|')
  branch=$(git branch --show-current)
  if [[ -n "$branch" ]]; then
    repo_root=$(git rev-parse --show-toplevel)
    rel_path=${PWD#$repo_root}
    url="${url}/tree/${branch}${rel_path}"
  fi
  open $url
}
