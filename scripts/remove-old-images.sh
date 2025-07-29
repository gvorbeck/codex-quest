#!/bin/bash

# Remove old JPG and PNG files after conversion to WebP
echo "Removing old image files..."

# Function to remove old images in a directory
remove_old_images() {
    local dir="$1"
    echo "Removing old images in: $dir"
    
    find "$dir" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | while read -r img; do
        # Get the directory and filename without extension
        dir_path=$(dirname "$img")
        filename=$(basename "$img")
        name_without_ext="${filename%.*}"
        
        # Check if corresponding WebP exists
        webp_file="$dir_path/$name_without_ext.webp"
        
        if [ -f "$webp_file" ]; then
            echo "Removing: $img (WebP exists: $webp_file)"
            rm "$img"
        else
            echo "Keeping: $img (No WebP equivalent found)"
        fi
    done
}

# Remove old images in public directories
remove_old_images "public/classes"
remove_old_images "public/faces" 
remove_old_images "public/races"
remove_old_images "public/spells"

# Remove old images in src/assets (but keep favicon.ico and logo files in public root)
remove_old_images "src/assets/images"

# Don't remove the ones in public root as they might be needed for PWA
echo "Keeping public/favicon.ico, public/logo192.png, public/logo512.png for PWA compatibility"

echo "Cleanup complete!"
