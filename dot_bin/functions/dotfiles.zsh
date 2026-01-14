dotfiles() {
  local selection repo_type file_path
  selection=$(
    {
      chezmoi managed | sed 's|^|~/|' | awk '{print "[public] " $0}'
      if [ -d "$HOME/.local/share/chezmoi-private" ]; then
        chezmoi --source ~/.local/share/chezmoi-private managed | \
          sed 's|^|~/|' | awk '{print "[private] " $0}'
      fi
    } | fzf --prompt="Select dotfile to edit: " \
      --height=40% \
      --reverse \
      --preview 'file=$(echo {} | sed "s/^\[.*\] //"); \
                 repo=$(echo {} | grep -o "^\[.*\]" | tr -d "[]"); \
                 if [ "$repo" = "private" ]; then \
                   chezmoi --source ~/.local/share/chezmoi-private cat "$file" 2>/dev/null; \
                 else \
                   chezmoi cat "$file" 2>/dev/null; \
                 fi || echo "Preview not available"' \
      --preview-window=right:60%:wrap
  )
  if [ -n "$selection" ]; then
    repo_type=$(echo "$selection" | grep -o '^\[.*\]' | tr -d '[]')
    file_path=$(echo "$selection" | sed 's/^\[.*\] //')
    if [ "$repo_type" = "private" ]; then
      chezmoi --source ~/.local/share/chezmoi-private edit --watch "$file_path" && \
      chezmoi --source ~/.local/share/chezmoi-private apply
    else
      chezmoi edit --watch "$file_path" && \
      chezmoi apply
    fi
    unalias -m "*"
    source ~/.zprofile
    source ~/.zshrc
  fi
}
