# Git Basics

## `git config`

* Personal values are stored in the `~/.gitconfig` or `~/.config/git/config’ files.  When you use the `--global` option, this is where those values are kept.  These are global values for all repositories
* Without the `--global` option, values are stored in the local directory (i.e. in the repository) in a file `.git/config`.  This is where you would store repository specific configuration parameters.

Each level overrides values from the previous level.

You can view all of your settings AND where they are coming from using the command `git config --list --show-origin`

## Identify Yourself

`git config --global user.name “John Doe”`

`git config --global user.email “johndoe@example.com”`
 
## Getting Help

`git help <verb>` or `git <verb> --help` will give you information about using the <verb> command with git.  For example, `git help config` or `git config --help` will provide all the ways that you can use the `config` command with git.

The command `git <verb> -h` will give a more concise help page rather than everything about that command.

## Creating And Initializing A Repository

1. Create a directory that you want to be your repository.  This is where your project files will live.
2. Inside the directory run the command `git init`.  This sets up the directory to be managed by git.  (In reality this command creates the directory .git.  Inside that subdirectory is where git keeps all of its information about your directory.  So you could run this command on an existing directory that already has files in it.  Just keep in mind that nothing within the directory is being version-controlled yet.  You have to tell git to track files.  Any file that you tell git to track, it will then monitor that file to see if it changes.

If someone has already set up a repository on the web and you want to get a copy of that repository on your computer then you run the command `git clone <url>` where `<url>` is the URL of the website for the online repository.  This command will copy the online repository to your local computer, creating a folder that is already initialized.  One thing to note about cloning from GitHub, you will need to setup a personal access token.  Read the information [here](https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories#cloning-with-https-urls).

## Begin And Stop Tracking Files

Files in your repository directory can be **tracked** or **untracked**.  The tracked files are the ones that git knows about while the untracked files are any other files in the directory.

Any file that is tracked, git will pay attention to.  Git will notice if the file is *unmodified* (i.e. the file has not been changed since the last time you turned the file in to git), *modified* (i.e. the file has been changed since the last time it was turned in), or *staged* (i.e. the file is ready to be submitted to git).

After you have created a file, you need to tell git that you want it to track the file.  To do this you use the `add` command:

`git add <filename>`

This marks the file as a tracked file.  This will set the file to be in *modified* state since it hasn't yet been turned in to git yet.  If you ever want to stop git from tracking the file then you use the `rm` command:

`git rm <filename>`

This tells git to stop tracking the file.  It will no longer be included when you turn in changes to git.

To check what status the files in your directory are in you use the `status` command:

`git status`

If the command returns the result of "nothing to commit, working tree clean" then that means there are no tracked files that have been modified.  You might also see a list of untracked files, files that have been modified, or files that are staged and ready to be turned in to git.

## Stage And Commit Changes

Turning files in to git is a two-step process.  First, you must stage a file or group of files to be added with the **add** command, and then you must **commit** those staged files.  When you commit you must provide a short message explaining what is in the commit.  Here is an example of this process:

1. Create or edit files (e.g. dog.png and readme.txt)
2. Add those files: `git add dog.png readme.txt` -- notice you can add more than one file at a time.  Repeat this step if you want to add more files before you commit all of them at once.
3. Commit the staged files: `git commit -m "brief message" -- This will turn in all of the staged files and attach the message to this commit.  The message must be very brief and should describe what is being committed.  If you want to write a longer message the run the command `git commit` without the -m switch and your editor will be launched where you can type a longer message.

At any point you can use the `git status` command to check on the files and what their status is.  Use this command often.

If you want to remove a file from being staged then use the command `git reset <filename>` and the file will no longer be included in the next commit.

## Ignoring Files

Often you have files in your repository that you never want to include in a commit.  For example, when your code depends upon libraries that others have created.  Those libraries you do not want to ever include in your commits.  You may also have lock files (i.e. temporary files) that you never want to include or your compiled version of your code.  You can inform git of files and full directories that should always be ignored by creating a `.gitignore` text file.  Each line in this text file describes a file or set of files that should never be included.  Take a look at an example .gitignore file:

```
node_modules
build
.DS_Store
package-lock.json
```

All of these files or directories will not be shown when you run git.  They are, as far as git is concerned, not part of the repository even though those files are there.

You will need to `add` and `commit` this .gitignore file so THAT file will be included in the repository.

## Undo Mistakes

If you want to stop tracking a file you use the command:

`git rm <filename>` -- the file will no longer be included in commits.

If you want to take a file out of the staging area use the command:

`git reset <filename>` -- the changes to the file will no longer be included in the next commit.

If you want to revert a file back to what it looked like when you last committed it (i.e. throw away any changes you have made to the file):

`git checkout -- <filename>`

Pay attention when your run `git status` as it will give suggestions on useful commands.

## Browse Project History, View Changes Between Commits

`git log` lists the commits that have been made to the repository in reverse order (i.e. newest commits first).

The `-p` switch will show what was included/changed in each commit.

The `--graph` switch shows a ASCII tree to the side showing the different branches.

## Remote Repositories

It is common to have a remote copy of your repository.  There are several websites that provide these online remove repositories.  One such site is Github.  You can list the remote repositories attached to your local repository with the command:

`git remote` or `git remote -v` to be more verbose.

To add a remote repository use the command:

`git remote add <name> <URL>` where `<name>` is the short name you are using for the remote repository and `<URL>` is the full online URL.

If there is already a remote repository and you want to make a local copy of the online one use the command:

`git clone <URL>`

Cloning a repository automatically sets up the `origin` shortname to be attached to that remote repository.

The command `git fetch <name>` downloads everything from the online repository and a similar command, `git pull <name>` will download AND merge the online repository with your local repository.  If you leave off the `<name>` parameter then it will pull from the `origin` shortname.

`git push <name>` will send your local repository up to the remote one, provided noone else has made changes to the remote one since you last pulled.  If they have then you will need to pull (i.e. download and merge) and then push.

## Branches

Each repository has the `master` branch.  You can create side branches with the command:

`git branch <name>` -- creates a branch with the given name.

When you work on a file, add, and commit it, you are committing the file to a particular branch.  To switch to a different branch, type the command:

`git checkout <name>` -- this changes which branch you are working on.

To see these branches and the commits that were done to the different branches run the command:

`git log --oneline --decorate --graph --all`

To combine branches back together you use the command:

`git merge <name>` and the `<name>` branch will be merged into the current branch.

When merging you may have conflicts that need to be resolved before the branches can be merged.