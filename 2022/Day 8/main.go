package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func getScore(data []string, i int, j int) int {
	treeRune := rune(data[i][j])
	right := 0
	for _, tree := range data[i][j+1:] {
		right++
		if tree >= treeRune {
			break
		}
	}

	left := 0
	for yi := range data[i][:j] {
		left++
		if rune(data[i][j-yi-1]) >= treeRune {
			break
		}
	}

	bottom := 0
	for _, tree := range data[i+1:] {
		bottom++
		if rune(tree[j]) >= treeRune {
			break
		}
	}

	top := 0
	for xi := range data[:i] {
		top++
		if rune(data[i-xi-1][j]) >= treeRune {
			break
		}
	}

	return left * right * bottom * top
}

func main() {
	visible := "V"
	hidden := "H"

	readFile, err := os.Open("data.txt")
	if err != nil {
		fmt.Println(err)
	}

	fileScanner := bufio.NewScanner(readFile)
	fileScanner.Split(bufio.ScanLines)

	visibles := []string{}
	data := []string{}
	for fileScanner.Scan() {
		line := fileScanner.Text()
		visibleLine := strings.Clone(line)
		lMax := '0' - 1
		rMax := '0' - 1
		for i, lSize := range line {
			if lSize > lMax {
				visibleLine = visibleLine[:i] + visible + visibleLine[i+1:]
				lMax = lSize
			} else if visibleLine[i] != visible[0] {
				visibleLine = visibleLine[:i] + hidden + visibleLine[i+1:]
			}

			j := len(line) - i - 1
			rSize := rune(line[j])
			if rSize > rMax {
				visibleLine = visibleLine[:j] + visible + visibleLine[j+1:]
				rMax = rSize
			} else if visibleLine[j] != visible[0] {
				visibleLine = visibleLine[:j] + hidden + visibleLine[j+1:]
			}
		}

		fmt.Println(line)
		visibles = append(visibles, visibleLine)
		data = append(data, line)
	}

	for i := 0; i < len(data[0]); i++ {

		tMax := '0' - 1
		bMax := '0' - 1
		for li, line := range data {
			if rune(line[i]) > tMax {
				visibles[li] = visibles[li][:i] + visible + visibles[li][i+1:]
				tMax = rune(line[i])
			} else if visibles[li][i] != visible[0] {
				visibles[li] = visibles[li][:i] + hidden + visibles[li][i+1:]
			}

			lj := len(data) - li - 1
			linej := rune(data[lj][i])
			if rune(linej) > bMax {
				visibles[lj] = visibles[lj][:i] + visible + visibles[lj][i+1:]
				bMax = rune(linej)
			} else if visibles[lj][i] != visible[0] {
				visibles[lj] = visibles[lj][:i] + hidden + visibles[lj][i+1:]
			}
		}
	}

	readFile.Close()

	result1 := 0
	for _, visibleLine := range visibles {
		result1 += strings.Count(visibleLine, "V")
	}

	fmt.Println("Part 1:", result1)

	result2 := 0
	for i, line := range data {
		for j := range line {
			score := getScore(data, i, j)
			if score > result2 {
				result2 = score
			}
		}
	}

	fmt.Println("Part 2:", result2)
}
