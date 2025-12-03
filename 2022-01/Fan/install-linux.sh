echo "Installing FAN onto your PATH... (Make sure your system uses ~/.bashrc, otherwise edit this script.)"
echo "(Please make sure you run this as SUDO / ROOT.)"

while read p
do 
out="${out}
${p}"
done <  ~/.bashrc

echo "BACKUP:${out}\n\n">>linux-path-backup.txt
 
first="${PWD}/alias"
second="\\ "
first=${first/ /$second}

echo NEW PATH EXPORT: $first

echo "${out}
export PATH=$PATH:$first
" > ~/.bashrc

echo Done.
 
# Please do not modify this file, as it may damage your PATH system variable.