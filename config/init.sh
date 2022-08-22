#!/bin/sh
apt update
apt upgrade -y

adduser tom
apt install nginx
apt install -y nginx
systemctl status nginx

mkdir /home/tom/.ssh
chmod 700 /home/tom/.ssh
chown tom:tom /home/tom/.ssh
cp .ssh/authorized_keys /home/tom/.ssh/
chown tom:tom /home/tom/.ssh/authorized_keys
chmod 600 /home/tom/.ssh/authorized_keys

apt update
apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt-cache policy docker-ce
apt install docker-ce
usermod -aG docker tom

curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | tee /usr/share/keyrings/yarnkey.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | tee /etc/apt/sources.list.d/yarn.list
apt-get update & apt-get install yarn

systemctl stop nginx
certbot certonly --standalone --agree-tos -d risk.terourou.org  -m terourounz@gmail.com
certbot certonly --standalone --agree-tos -d plausible.terourou.org  -m terourounz@gmail.com
systemctl start nginx

cat << EOF > /etc/nginx/sites-available/risk.terourou.org
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    ssl_certificate /etc/letsencrypt/live/risk.terourou.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/risk.terourou.org/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozSSL:10m;  # about 40000 sessions

    ssl_session_tickets off;

    # modern configuration

    ssl_protocols TLSv1.3;
    ssl_prefer_server_ciphers on;

    # HSTS (ngx_http_headers_module is required) (63072000 seconds)

    add_header Strict-Transport-Security "max-age=63072000" always;

    # OCSP stapling

    ssl_stapling on;
    ssl_stapling_verify on;

    # verify chain of trust of OCSP response using Root CA and Intermediate certs

#    ssl_trusted_certificate /path/to/root_CA_cert_plus_intermediates;


    # replace with the IP address of your resolver

    resolver 8.8.8.8;

    server_name   risk.terourou.org;
    # root          /home/tom/disclosure-risk-app/app/build/;

    location /ws {
        proxy_pass http://localhost:8081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "Upgrade";
    }

    location / {
        root /home/tom/disclosure-risk-app/app/build/;
        try_files $uri /index.html;
    }

    error_page 404 /404.html;
    location = /40x.html {
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
    }
}
EOF

cat << EOF > /etc/nginx/sites-available/risk.terourou.org
server {
    listen       80;
    listen       [::]:80;

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    ssl_certificate /etc/letsencrypt/live/plausible.terourou.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/plausible.terourou.org/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozSSL:10m;  # about 40000 sessions
    ssl_session_tickets off;

    # modern configuration
    ssl_protocols TLSv1.3;
    ssl_prefer_server_ciphers on;

    # HSTS (ngx_http_headers_module is required) (63072000 seconds)
    add_header Strict-Transport-Security "max-age=63072000" always;

    # OCSP stapling
    ssl_stapling on;
    ssl_stapling_verify on;

    # verify chain of trust of OCSP response using Root CA and Intermediate certs
#    ssl_trusted_certificate /path/to/root_CA_cert_plus_intermediates;

    # replace with the IP address of your resolver
    resolver 8.8.8.8;

    server_name   plausible.terourou.org;
    # root          /home/tom/disclosure-risk-app/app/build/;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    error_page 404 /404.html;
        location = /40x.html {
    }

    error_page 500 502 503 504 /50x.html;
        location = /50x.html {
    }
}
EOF

rm -f /etc/nginx/sites-enabled/risk.terourou.org
ln -s /etc/nginx/sites-available/risk.terourou.org /etc/nginx/sites-enabled/risk.terourou.org
ln -s /etc/nginx/sites-available/plausible.terourou.org /etc/nginx/sites-enabled/plausible.terourou.org
rm -f /etc/nginx/sites-enabled/default
systemctl reload nginx


su - tom

git clone https://github.com/terourou/disclosure-risk-app.git
echo "REACT_APP_R_HOST=\"wss://risk.terourou.org/ws\"" >> disclosure-risk-app/app/.env
cat << EOF > update.sh
#!/bin/sh

cd disclosure-risk-app && git pull
cd app && yarn && yarn build

docker pull tmelliott/disrisk
docker stop disrisk-app || true
docker run --rm -d -p 8081:8081 --name disrisk-app tmelliott/disrisk
EOF

# turn on docker-compose for hosting service ...
# download git repository
# set config:
# ADMIN_USER_EMAIL=tom.elliott@auckland.ac.nz
# ADMIN_USER_NAME=admin
# ADMIN_USER_PWD=PASSWORD
# BASE_URL=https://risk.terourou.org
# PORT=8000
# LISTEN_IP=127.0.0.1
# SECRET_KEY_BASE=SECRET_KEY


chmod +x update.sh
./update
