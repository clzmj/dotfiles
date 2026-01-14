# Dotfiles

```bash
chezmoi init clzmj
```

Personal dotfiles managed with [chezmoi](https://chezmoi.io/).

## Setup

### 1. Fork and clone the repository

If you want to use this config, I highly recommend forking the repo first and then cloning from your own account. This way you can customize it freely and push your own changes.

```bash
chezmoi init <your-username>
```

Chezmoi will automatically guess the full git repo URL. For example, `chezmoi init clzmj` expands to `https://github.com/clzmj/dotfiles.git`.

| Pattern | HTTPS Repo | SSH Repo (with `--ssh`) |
|---------|------------|-------------------------|
| `user` | `https://github.com/user/dotfiles.git` | `git@github.com:user/dotfiles.git` |
| `user/repo` | `https://github.com/user/repo.git` | `git@github.com:user/repo.git` |
| `site/user/repo` | `https://user@site/user/repo.git` | `git@site:user/repo.git` |

Or if you prefer to clone manually:

```bash
git clone https://github.com/<your-username>/dotfiles.git ~/.local/share/chezmoi
```

### 2. Customize the Brewfile

Edit `~/.local/share/chezmoi/dot_Brewfile` to add or remove packages:

```bash
$EDITOR ~/.local/share/chezmoi/dot_Brewfile
```

- **Keep it minimal** - delete any `brew`, `cask`, or `tap` lines for packages you don't need
- You can always install packages directly with `brew install <package>` later
- The `sysupdate` command will automatically update your Brewfile when you install new packages

### 3. Install packages with Homebrew Bundle

```bash
brew bundle install --file=~/.Brewfile
```

This will install all taps, brews, casks, and other dependencies defined in your Brewfile.

### 4. Keep your system updated

Run the `sysupdate` command to update everything:

```bash
sysupdate
```

This command will:
- Update and upgrade all Homebrew packages
- Dump current packages back to the Brewfile
- Sync changes with chezmoi
- Clean up unused packages
- Reload your shell configuration

## Private Dotfiles

You can have your own separate `chezmoi-private` repository at `~/.local/share/chezmoi-private` that works seamlessly alongside the public dotfiles. This is recommended for storing encrypted files, secrets, and sensitive configurations.

To set it up:

```bash
chezmoi --source ~/.local/share/chezmoi-private init https://github.com/<username>/dotfiles-private.git
```

The `sysupdate` and `dotfiles` commands automatically detect and work with both repositories.

## Shell Functions

### `sysupdate`

Updates your entire system:

```bash
sysupdate
```

What it does:
1. Runs `brew update` and `brew upgrade`
2. Dumps current packages to `$HOMEBREW_BREWFILE`
3. Adds the updated Brewfile to chezmoi
4. Cleans up unused packages with `brew bundle cleanup --zap`
5. Reloads shell aliases and sources `~/.zshrc`
6. Re-adds changes to both public and private chezmoi repos (if on main machine)

### `dotfiles`

Interactive fuzzy finder for editing dotfiles:

```bash
dotfiles
```

What it does:
1. Lists all managed dotfiles from both public and private chezmoi repos
2. Opens an fzf selector with live preview of file contents
3. Opens the selected file in your editor with `chezmoi edit --watch`
4. Applies changes and reloads shell configuration when done
