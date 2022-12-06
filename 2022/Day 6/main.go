package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func IsValid(line string) bool {
	for n, l := range line[1:] {
		if strings.IndexRune(line[:n+1], l) != -1 {
			return false
		}
	}
	return true
}

func GetStart(line string, length int) int {

	for i := 0; i < len(line)-length; i++ {
		if IsValid(line[i : i+length]) {
			return i + length
		}
	}

	return -1
}

func main() {
	readFile, err := os.Open("data.txt")
	if err != nil {
		fmt.Println(err)
	}

	fileScanner := bufio.NewScanner(readFile)
	fileScanner.Split(bufio.ScanLines)

	result1 := 0
	result2 := 0
	for fileScanner.Scan() {
		line := fileScanner.Text()
		result1 = GetStart(line, 4)
		result2 = GetStart(line, 14)
	}

	readFile.Close()

	fmt.Println("Part 1:", result1)
	fmt.Println("Part 2:", result2)
}
