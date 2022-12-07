package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"

	"golang.org/x/exp/slices"
)

type File struct {
	Name string
	Size int64
}

type Folder struct {
	Parent  *Folder
	Name    string
	Size    int64
	Files   []File
	Folders []Folder
}

func Print(folder Folder, level int) {
	append := strings.Repeat("  ", level)
	fmt.Println(append + "- " + folder.Name + " (dir, size=" + strconv.FormatInt(folder.Size, 10) + ")")
	for _, f := range folder.Files {
		fmt.Println(append + "  - " + f.Name + " (file, size=" + strconv.FormatInt(f.Size, 10) + ")")
	}
	for _, f := range folder.Folders {
		Print(f, level+1)
	}
}

func main() {
	readFile, err := os.Open("data.txt")
	if err != nil {
		fmt.Println(err)
	}

	fileScanner := bufio.NewScanner(readFile)
	fileScanner.Split(bufio.ScanLines)

	root := Folder{
		Name:    "/",
		Parent:  nil,
		Size:    0,
		Files:   []File{},
		Folders: []Folder{},
	}

	currentDir := &root
	command := ""
	commandResults := []string{}
	for fileScanner.Scan() {
		line := fileScanner.Text()
		if line[0] == '$' {
			if command == "ls" {
				processList(commandResults, currentDir)
			} else if command == "cd" {
				currentDir = processChangeDirectory(commandResults[0], currentDir, &root)
			}

			parsedCommand := strings.Split(line[2:], " ")
			command = parsedCommand[0]
			if command == "cd" {
				commandResults = []string{parsedCommand[1]}
			} else {
				commandResults = []string{}
			}
		} else {
			commandResults = append(commandResults, line)
		}
	}

	if command == "ls" {
		processList(commandResults, currentDir)
	}

	readFile.Close()

	CalcSize(&root)

	fmt.Println("Part 1:", CalcResult1(root, 100000))

	needed := 30000000 - 70000000 + root.Size
	fmt.Println("Part 2:", CalcResult2(root, needed))
}

func processList(commandResults []string, currentDir *Folder) {
	for _, res := range commandResults {
		fileOrFolder := strings.Split(res, " ")
		if fileOrFolder[0] == "dir" {
			currentDir.Folders = append(currentDir.Folders, Folder{
				Name:    fileOrFolder[1],
				Parent:  currentDir,
				Size:    0,
				Files:   []File{},
				Folders: []Folder{},
			})
		} else {
			size, _ := strconv.ParseInt(fileOrFolder[0], 10, 64)
			currentDir.Files = append(currentDir.Files, File{
				Name: fileOrFolder[1],
				Size: size,
			})
		}
	}
}

func processChangeDirectory(directory string, currentDir *Folder, root *Folder) *Folder {
	if directory == ".." {
		return currentDir.Parent
	} else if directory == "/" {
		return root
	} else {
		dirN := slices.IndexFunc(currentDir.Folders, func(f Folder) bool {
			return f.Name == directory
		})

		if dirN == -1 {
			currentDir.Folders = append(currentDir.Folders, Folder{
				Name:    directory,
				Parent:  currentDir,
				Files:   []File{},
				Folders: []Folder{},
			})

			dirN = slices.IndexFunc(currentDir.Folders, func(f Folder) bool {
				return f.Name == directory
			})
		}

		return &currentDir.Folders[dirN]
	}
}

func CalcSize(folder *Folder) int64 {
	size := int64(0)
	for _, f := range folder.Files {
		size += f.Size
	}
	for i := range folder.Folders {
		size += CalcSize(&folder.Folders[i])
	}

	folder.Size = size
	return size
}

func CalcResult1(folder Folder, maxSize int64) int64 {
	size := int64(0)

	for _, f := range folder.Folders {
		if f.Size <= maxSize {
			size += f.Size
		}

		size += CalcResult1(f, maxSize)
	}

	return size
}

func CalcResult2(folder Folder, minSize int64) int64 {
	result2 := int64(0)
	if folder.Size >= minSize {
		result2 = folder.Size
	}

	for _, f := range folder.Folders {
		size := CalcResult2(f, minSize)
		if (result2 != 0 && size < result2) && size >= minSize {
			result2 = size
		}
	}

	return result2
}
