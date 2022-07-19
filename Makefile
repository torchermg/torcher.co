-include .env
export

torture-palace = torcher.co
public = $(DIGITALOCEAN_PUBLIC_BUCKET)
private = $(DIGITALOCEAN_PRIVATE_BUCKET)

build: yarn
	node esbuild.config.js

serve: yarn
	node esbuild.config.js serve

yarn:
	yarn

prepare-assets:
	./prepare-assets.sh

upload: prepare-assets
	s3cmd sync --acl-public -r assets/build/public/ s3://$(public)/
	s3cmd sync -r assets/build/private/ s3://$(private)/

deploy: build upload
	docker-compose up --build
