package main

import (
	"fmt"
	"os"
	"path/filepath"
)

// ResetBlockchainData removes all blockchain data
// This ensures a fresh start when deploying to a new server
func main() {
	fmt.Println("🧹 Starting blockchain data cleanup...")

	// Define data directories to clean
	dataDirs := []string{
		"./blockchain-data",
		"./chain-data",
		"./data",
		"./storage-data",
	}

	cleanedCount := 0

	for _, dir := range dataDirs {
		absPath, err := filepath.Abs(dir)
		if err != nil {
			fmt.Printf("⚠️  Warning: Could not resolve path for %s: %v\n", dir, err)
			continue
		}

		// Check if directory exists
		if _, err := os.Stat(absPath); os.IsNotExist(err) {
			fmt.Printf("⏭️  Skipping %s (does not exist)\n", dir)
			continue
		}

		// Remove the directory and all its contents
		err = os.RemoveAll(absPath)
		if err != nil {
			fmt.Printf("❌ Error removing %s: %v\n", dir, err)
			continue
		}

		fmt.Printf("✅ Removed: %s\n", dir)
		cleanedCount++
	}

	if cleanedCount > 0 {
		fmt.Printf("\n✨ Blockchain data cleanup completed! Removed %d directories\n", cleanedCount)
		fmt.Println("📊 All blockchain data has been reset to 0")
		fmt.Println("🚀 Ready for fresh deployment")
	} else {
		fmt.Println("\n✨ No blockchain data found to clean")
		fmt.Println("🚀 Already in fresh state")
	}
}
