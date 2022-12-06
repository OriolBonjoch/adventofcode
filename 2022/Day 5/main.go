package main

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
	"strconv"
)

func main() {
	readFile, err := os.Open("data.txt")
	if err != nil {
		fmt.Println(err)
	}

	fileScanner := bufio.NewScanner(readFile)
	fileScanner.Split(bufio.ScanLines)

	stack1 := []string{}
	for fileScanner.Scan() {
		line := fileScanner.Text()
		if len(line) == 0 {
			break
		}

		if len(stack1) == 0 {
			stack1 = make([]string, (1+len(line))/4)
		}

		for i := 0; i < len(line); i += 4 {
			if _, err := strconv.Atoi(string(line[i+1])); err == nil {
				break
			}

			if line[i+1] != ' ' {
				stack1[i/4] += string(line[i+1])
			}
		}
	}

	stack2 := make([]string, len(stack1))
	copy(stack2, stack1)
	r, _ := regexp.Compile("^move (\\d+) from (\\d+) to (\\d+)$")
	for fileScanner.Scan() {
		line := fileScanner.Text()
		match := r.FindStringSubmatch(line)
		move, _ := strconv.Atoi(match[1])
		from, _ := strconv.Atoi(match[2])
		to, _ := strconv.Atoi(match[3])

		for i := 0; i < move; i++ {
			stack1[to-1] = string(stack1[from-1][0]) + stack1[to-1]
			stack1[from-1] = stack1[from-1][1:]

		}

		stack2[to-1] = string(stack2[from-1][:move]) + stack2[to-1]
		stack2[from-1] = stack2[from-1][move:]
	}

	readFile.Close()

	result1 := ""
	result2 := ""
	for i, _ := range stack1 {
		if len(stack1[i]) > 0 {
			result1 += string(stack1[i][0])
		}

		if len(stack2[i]) > 0 {
			result2 += string(stack2[i][0])
		}
	}

	fmt.Println("Part 1:", result1)
	fmt.Println("Part 2:", result2)
}
