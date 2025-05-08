#!/bin/bash

# Text styling
BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print header
echo -e "${BOLD}=== CookAtlas Project Cleaner & Builder ===${NC}"
echo "This script will clean and rebuild your project components"
echo

# Function to handle cleaning a directory
clean_directory() {
  local dir=$1
  echo -e "${YELLOW}Cleaning ${dir} directory...${NC}"

  if [ "$dir" = "root" ]; then
    # Clean root directory
    rm -rf node_modules 2>/dev/null || true
    rm -f package-lock.json 2>/dev/null || true
  else
    # Clean subdirectory if it exists
    if [ -d "$dir" ]; then
      cd $dir
      rm -rf node_modules 2>/dev/null || true
      rm -rf dist 2>/dev/null || true
      rm -rf build 2>/dev/null || true
      rm -rf .cache 2>/dev/null || true
      rm -f package-lock.json 2>/dev/null || true
      cd ..
      echo -e "  ${GREEN}✓${NC} $dir cleaned successfully"
    else
      echo -e "  ${RED}✗${NC} $dir directory not found, skipping..."
    fi
  fi
}

# Function to build a directory
build_directory() {
  local dir=$1

  if [ "$dir" = "root" ]; then
    echo -e "${YELLOW}Installing root dependencies...${NC}"
    npm install
    if [ $? -eq 0 ]; then
      echo -e "  ${GREEN}✓${NC} Root dependencies installed successfully"
    else
      echo -e "  ${RED}✗${NC} Failed to install root dependencies"
      exit 1
    fi
  else
    # Build subdirectory if it exists
    if [ -d "$dir" ]; then
      echo -e "${YELLOW}Building $dir...${NC}"
      cd $dir

      # Install dependencies
      echo "  Installing $dir dependencies..."
      npm install
      if [ $? -ne 0 ]; then
        echo -e "  ${RED}✗${NC} Failed to install $dir dependencies"
        cd ..
        exit 1
      fi

      # Run build if the script exists in package.json
      if grep -q '"build"' package.json; then
        echo "  Building $dir application..."
        npm run build
        if [ $? -eq 0 ]; then
          echo -e "  ${GREEN}✓${NC} $dir built successfully"
        else
          echo -e "  ${RED}✗${NC} Failed to build $dir"
          cd ..
          exit 1
        fi
      else
        echo -e "  ${YELLOW}⚠${NC} No build script found for $dir, skipping build step"
      fi

      cd ..
    else
      echo -e "${RED}✗${NC} $dir directory not found, skipping build..."
    fi
  fi
}

# Clean npm cache
clean_npm_cache() {
  echo -e "${YELLOW}Cleaning npm cache...${NC}"
  npm cache clean --force || true
  echo -e "  ${GREEN}✓${NC} npm cache cleaned"
}

# Main execution

# Ask for confirmation
read -p "This will clean all node_modules and build artifacts. Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Operation cancelled."
  exit 0
fi

# Cleaning phase
echo -e "\n${BOLD}=== CLEANING PHASE ===${NC}"
clean_directory "root"
clean_directory "frontend"
clean_directory "backend"
clean_npm_cache

echo -e "\n${BOLD}=== BUILDING PHASE ===${NC}"
build_directory "root"
build_directory "backend"
build_directory "frontend"

echo -e "\n${GREEN}${BOLD}✓ All operations completed successfully!${NC}"
echo "Your project has been cleaned and rebuilt."