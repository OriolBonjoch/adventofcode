package main

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
	"strconv"
)

func Matches1(limits [4]int) bool {
	if limits[0] >= limits[2] && limits[1] <= limits[3] {
		return true
	}
	if limits[2] >= limits[0] && limits[3] <= limits[1] {
		return true
	}

	return false
}

func Matches2(limits [4]int) bool {
	if limits[1] >= limits[2] && limits[0] <= limits[3] {
		return true
	}

	if limits[3] >= limits[0] && limits[2] <= limits[1] {
		return true
	}

	return false
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
	r, _ := regexp.Compile("\\d+")
	for fileScanner.Scan() {
		line := fileScanner.Text()
		matches := r.FindAllString(line, 4)
		limits := [4]int{}
		for i, m := range matches {
			limits[i], _ = strconv.Atoi(m)
		}

		if Matches1(limits) {
			sum1++
			sum2++
		} else if Matches2(limits) {
			sum2++
		}
	}

	readFile.Close()
	fmt.Println("Part 1:", sum1)
	fmt.Println("Part 2:", sum2)
}
