#!/bin/bash

# Convert images to WebP and create a mapping file
echo "Converting images to WebP format..."

# Create a temporary file to store the conversion mapping
MAPPING_FILE="/tmp/image_mapping.txt"
> "$MAPPING_FILE"

# Function to convert images in a directory
convert_directory() {
    local dir="$1"
    echo "Processing directory: $dir"
    
    find "$dir" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | while read -r img; do
        # Get the directory and filename without extension
        dir_path=$(dirname "$img")
        filename=$(basename "$img")
        name_without_ext="${filename%.*}"
        ext="${filename##*.}"
        
        # Create WebP filename
        webp_file="$dir_path/$name_without_ext.webp"
        
        # Convert to WebP
        if [ ! -f "$webp_file" ]; then
            echo "Converting $img to WebP..."
            if cwebp -q 80 "$img" -o "$webp_file"; then
                echo "$filename -> $name_without_ext.webp" >> "$MAPPING_FILE"
                echo "✓ Converted: $img -> $webp_file"
            else
                echo "✗ Failed to convert: $img"
            fi
        else
            echo "WebP already exists: $webp_file"
            echo "$filename -> $name_without_ext.webp" >> "$MAPPING_FILE"
        fi
    done
}

# Convert images in public directories
convert_directory "public/classes"
convert_directory "public/faces" 
convert_directory "public/races"
convert_directory "public/spells"

# Convert images in src/assets
convert_directory "src/assets/images"

echo "Conversion complete! Mapping saved to $MAPPING_FILE"
echo "Contents of mapping file:"
cat "$MAPPING_FILE"
