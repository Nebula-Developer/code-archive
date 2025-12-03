echo "Installing FAN onto your PATH... (Make sure your system uses /etc/paths, otherwise edit this script.)"
echo "(Please make sure you run this as SUDO / ROOT.)"

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )/alias

echo "BACKUP:${PATH}\n\n">>macos-path-backup.txt

echo $'\n\nexport FANDIR="'$SCRIPT_DIR'"'>>~/.zshrc
echo $'export PATH=$PATH:$FANDIR'>>~/.zshrc

echo Done.
 
# Please do not modify this file, as it may damage your PATH system variable.