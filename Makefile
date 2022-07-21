-include .env
export

torture-palace = torcher.co
public = $(S3_PUBLIC_BUCKET)
private = $(S3_PRIVATE_BUCKET)

build: yarn
	node esbuild.config.js

clean:
	rm -rf build
	mkdir build

serve: yarn
	node esbuild.config.js serve

yarn:
	yarn

prepare-assets:
	./prepare-assets.sh

upload: prepare-assets
	s3cmd sync --acl-public -r assets/build/public/ s3://$(public)/
	s3cmd sync -r assets/build/private/ s3://$(private)/

deploy: upload clean build
	docker-compose up --build -d
