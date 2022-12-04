package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
	"unicode"
)

func Matches1(first string, second string) (int, rune) {
	for _, letter := range first {
		if strings.Index(second, string(letter)) == -1 {
			continue
		}

		if unicode.IsLower(letter) {
			return int(letter) - int('a') + 1, letter
		} else {
			return int(letter) - int('A') + 27, letter
		}
	}

	return 0, '-'
}

func Matches2(lines [3]string) (int, rune) {
	for _, letter := range lines[0] {
		if strings.Index(lines[1], string(letter)) == -1 ||
			strings.Index(lines[2], string(letter)) == -1 {
			continue
		}

		if unicode.IsLower(letter) {
			return int(letter) - int('a') + 1, letter
		} else {
			return int(letter) - int('A') + 27, letter
		}
	}

	return 0, '-'
}

func main() {
	readFile, err := os.Open("data.txt")
	if err != nil {
		fmt.Println(err)
	}

	fileScanner := bufio.NewScanner(readFile)
	fileScanner.Split(bufio.ScanLines)

	sum1 := 0
	sum2 := 0
	lines := [3]string{"", "", ""}
	n := 0
	for fileScanner.Scan() {
		line := fileScanner.Text()
		half := len(line) / 2
		m, _ := Matches1(line[:half], line[half:])
		sum1 += m

		lines[n%3] = line
		if n%3 == 2 {
			m, _ := Matches2(lines)
			sum2 += m
		}

		n++
	}

	readFile.Close()
	fmt.Println("Part 1:", sum1)
	fmt.Println("Part 2:", sum2)
}
