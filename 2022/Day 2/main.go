package main

import (
	"bufio"
	"fmt"
	"os"
)

func Score1(play string) int {
	return map[string]int{
		"A X": 3 + 1,
		"A Y": 6 + 2,
		"A Z": 0 + 3,

		"B X": 0 + 1,
		"B Y": 3 + 2,
		"B Z": 6 + 3,

		"C X": 6 + 1,
		"C Y": 0 + 2,
		"C Z": 3 + 3,
	}[play]
}

func Score2(play string) int {
	return map[string]int{
		"A X": 0 + 3,
		"A Y": 3 + 1,
		"A Z": 6 + 2,

		"B X": 0 + 1,
		"B Y": 3 + 2,
		"B Z": 6 + 3,

		"C X": 0 + 2,
		"C Y": 3 + 3,
		"C Z": 6 + 1,
	}[play]
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
	for fileScanner.Scan() {
		line := fileScanner.Text()
		sum1 += Score1(line)
		sum2 += Score2(line)
	}

	readFile.Close()
	fmt.Println("Part 1:", sum1)
	fmt.Println("Part 2:", sum2)
}
