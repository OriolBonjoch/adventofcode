package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strconv"
)

func Max(a []int, b int) []int {
	if a[0] > b {
		return a
	}

	a[0] = b
	sort.Ints(a)
	return a
}

func Sum(array []int) int {
	result := 0
	for _, v := range array {
		result += v
	}

	return result
}

func main() {
	readFile, err := os.Open("data.txt")
	if err != nil {
		fmt.Println(err)
	}

	fileScanner := bufio.NewScanner(readFile)
	fileScanner.Split(bufio.ScanLines)

	max := []int{0, 0, 0}
	cur := 0
	for fileScanner.Scan() {
		line := fileScanner.Text()
		if len(line) > 0 {
			n, _ := strconv.Atoi(line)
			cur += n
		} else {
			max = Max(max, cur)
			cur = 0
		}
	}

	readFile.Close()
	fmt.Println("Part 1:", Max(max, cur)[2])
	fmt.Println("Part 2:", Sum(Max(max, cur)))
}
