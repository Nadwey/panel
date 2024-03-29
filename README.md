# Vulnerable Pterodactyl®

For the love of god, please don't use this fork.  
It was made because I got angry that the eggs aren't importing on 1.11.5

## Why update every package?

npm

## Known issues

- Tests (who cares)
- Some features missing (mainly because these just aren't implemented in the develop branch), e. g.:
    - Admin -> Server -> Databases/Mounts: empty view
- Server's primary allocation id can reference a non-existant/other server's allocation if you do some specific things, but I don't have the brain to fix that, so for now I just recommend editing the database manually
