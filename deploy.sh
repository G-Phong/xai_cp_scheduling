# Installieren von Node.js und npm
wget -qO- https://deb.nodesource.com/setup_14.x | bash -
apt-get install -y nodejs

# Ihr restlicher Build-Prozess
cd xai_frontend
npm install
npm run build
