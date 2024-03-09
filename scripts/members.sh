#!/usr/bin/env bash

# Check if the user has given an alternative location (file)
if [ "$#" -ge 1 ]; then
    JSON_FILE=$1
else
    JSON_FILE="json/members.json"
fi

# Function to create the file and its directory if they don't exist
mkfile() { mkdir -p "$(dirname "$1")" && touch "$1"; }

# Check if the JSON file exists, if not, create it with the initial structure
if [ ! -f "$JSON_FILE" ]; then
    mkfile $JSON_FILE
    echo '{
        "members": []
    }' > "$JSON_FILE"
fi

# Get the data
read -rp "Enter Name: " name
echo "Now enter the user social media links:"
read -rp "Github: " github
read -rp "LinkedIn " linkedin
read -rp "Twitter(X) " twitter
read -rp "Portfolio website: " portifolio
read -rp "Blog website: " blog

# Read multi-line notes
echo "Now enter any extra note that you would like to be included (signal end using '~'):"
read -d '~' notes

# Generate a UUID
UUID=$(uuidgen)

# Prepare the new member data
new_member=$(jq -n \
    --arg name "$name" \
    --arg uuid "$UUID" \
    --arg github "$github" \
    --arg linkedin "$linkedin" \
    --arg twitter "$twitter" \
    --arg portifolio "$portifolio" \
    --arg blog "$blog" \
    --arg notes "$notes" \
    '{
        "name": $name,
        "id": $uuid,
        "socials": {
            "github": $github,
            "linkedin": $linkedin,
            "twitter": $twitter,
            "portifolio": $portifolio,
            "blog": $blog
        },
        "notes": $notes
    }')

# Add the new member to the JSON file (use tmp file as intermediaries to avoid data loss)
jq '.members += [$new_member]' --argjson new_member "$new_member" "$JSON_FILE" > "${JSON_FILE}.tmp" && mv "${JSON_FILE}.tmp" "$JSON_FILE"

echo "Member added successfully."

