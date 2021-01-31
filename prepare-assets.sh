#!/usr/bin/env bash

set -e

cd "$(dirname "$0")"

productions="./assets/source/productions/"
images="./assets/source/images/"
legal="./assets/source/legal/"

public_dir="./assets/build/public"
private_dir="./assets/build/private"
mkdir -p "$public_dir"
mkdir -p "$private_dir"

public_dir="$(realpath "$public_dir")"
private_dir="$(realpath "$private_dir")"

imagemagick_args="-strip -interlace JPEG -colorspace RGB -quality 90"

# productions
for production in "$productions"/*; do # "$production = /path/to/B1-damn-it-all-to-hell
	production="$(realpath "$production")"

	[ ! -d "$production" ] && continue
	production_basename="$(basename "$production")" # production_basename = B1-damn-it-all-to-hell

	public="false"
	source "$production/production.env"

	cover="$production/$production_basename-cover.png"
	# render="$production/$production_basename-render.png"

	cover_128="$public_dir/$production_basename-cover-128.jpeg"
	cover_256="$public_dir/$production_basename-cover-256.jpeg"
	cover_512="$public_dir/$production_basename-cover-512.jpeg"
	cover_1024="$public_dir/$production_basename-cover-1024.jpeg"
	# render_768="$public_dir/$production_basename-render-768.jpeg"

	[ -f "$cover_128" ] || convert "$cover" $imagemagick_args -resize x128 "$cover_128"
	[ -f "$cover_256" ] || convert "$cover" $imagemagick_args -resize x256 "$cover_256"
	[ -f "$cover_512" ] || convert "$cover" $imagemagick_args -resize x512 "$cover_512"
	[ -f "$cover_1024" ] || convert "$cover" $imagemagick_args -resize x1024 "$cover_1024"
	# [ -f "$render_768" ] || convert "$render" $imagemagick_args -resize x768 "$render_768"

	if [ "$public" = 'true' ]; then
		zip="$public_dir/$production_basename.zip"
	else
		zip="$private_dir/$production_basename.zip"
	fi
	if [ ! -f "$zip" ]; then
		zip_temp="$(mktemp -d)"
		track_count="$(ls "$production/tracks/" | wc -l)"
	fi
	
	for track in "$production/tracks"/*; do
		track="$(realpath "$track")"
		source "$track/track.env"

		track_basename="$(basename "$track")" # track_basename = B1-1-damn-it-all-to-hell
		master="$track/$track_basename-master.wav"
		aac="$public_dir/$track_basename-master.aac"
		ogg="$public_dir/$track_basename-master.ogg"
		[ -f "$aac" ] || ffmpeg -i "$master" -b:a 192k \
			-metadata title="$title" \
			-metadata album="$album" \
			-metadata album_artist="$album_artist" \
			-metadata TBPM="$bpm" \
			"$aac"
		[ -f "$ogg" ] || ffmpeg -i "$master" -b:a 192k \
			-metadata title="$title" \
			-metadata album="$album" \
			-metadata album_artist="$album_artist" \
			-metadata TBPM="$bpm" \
			"$ogg"
		if [ -d "$zip_temp" ]; then
			if [ "$track_count" -eq 1 ]; then
				# only one track
				master_dir="$zip_temp/$album/"
				stems_dir="$zip_temp/$album/stems"
			else
				# more than one track
				master_dir="$zip_temp/$album/compositions/"
				stems_dir="$zip_temp/$album/stems/$title"
			fi
			mkdir -p "$master_dir"
			ffmpeg -i "$master" \
				-metadata title="$title" \
				-metadata album="$album" \
				-metadata album_artist="$album_artist" \
				-metadata TBPM="$bpm" \
				"$master_dir/$title.wav"

			mkdir -p "$(dirname "$stems_dir")"
			ln -s "$track/stems" "$stems_dir"
		fi
	done
	
	if [ -d "$zip_temp" ]; then
		(cd "$zip_temp" && zip -r "$zip" .)
		rm -rf "$zip_temp"
	fi
done

# images

prepare_image () {
	image=$1
	height=$2

	echo $image
	basename="$(basename "$image")"
	name="${basename%.*}"

	out="$public_dir/$name.jpeg"

	[ -f "$out" ] || convert "$image" -resize x$height $imagemagick_args "$out"
}

prepare_image "$images/hero-mihailo-wide.png" 1024
prepare_image "$images/hero-mihailo-tall.png" 1024

# legal
for docx in "$legal"/*.docx; do
	basename="$(basename "$docx")"
	name="${basename%.*}"
	pandoc "$docx" -o "$public_dir/$name.html"
done
