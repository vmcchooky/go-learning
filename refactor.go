package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

type Topic struct {
	Category    string `json:"category"`
	URL         string `json:"url"`
	Title       string `json:"title"`
	Description string `json:"desc"`
	Content     string `json:"content"`
	HTML        string `json:"html"`
}

const searchDataPath = "assets/js/search_data.js"

const (
	prismCSSLine  = `  <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />`
	prismJSLine   = `  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>`
	prismGoJSLine = `  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-go.min.js"></script>`
)

var (
	reOnclick   = regexp.MustCompile(`\s*onclick="[^"]+"`)
	reOninput   = regexp.MustCompile(`\s*oninput="[^"]+"`)
	reSpanStart = regexp.MustCompile(`<span class="(kw|tp|num|str|cmt|fn)">`)
	reSpanEnd   = regexp.MustCompile(`</span>`)
	reText      = regexp.MustCompile(`<[^>]+>`)
	reCodeWrap  = regexp.MustCompile(`(?s)^\s*<code[^>]*>(.*)</code>\s*$`)
	reTopicCard = regexp.MustCompile(`(?s)(<div class="topic-card"[^>]*>.*?<div class="(?:topic-name|kw-title)">([^<]+)</div>.*?<div class="topic-desc">([^<]+)</div>.*?<div class="topic-detail">(.*?)</div>\s*</div>)`)
)

func replacePreBlocks(content string) string {
	return regexp.MustCompile(`(?s)<pre>.*?</pre>`).ReplaceAllStringFunc(content, func(match string) string {
		inner := match[5 : len(match)-6]
		if wrapped := reCodeWrap.FindStringSubmatch(inner); len(wrapped) == 2 {
			inner = wrapped[1]
		}
		inner = reSpanStart.ReplaceAllString(inner, "")
		inner = reSpanEnd.ReplaceAllString(inner, "")
		return fmt.Sprintf(`<pre><code class="language-go">%s</code></pre>`, inner)
	})
}

func normalizeAssets(content string, assets []string, closingTag string) string {
	for _, asset := range assets {
		content = strings.ReplaceAll(content, asset+"\r\n", "")
		content = strings.ReplaceAll(content, asset+"\n", "")
		content = strings.ReplaceAll(content, asset, "")
	}
	return strings.Replace(content, closingTag, strings.Join(assets, "\n")+"\n"+closingTag, 1)
}

func main() {
	files, err := filepath.Glob("*.html")
	if err != nil {
		panic(err)
	}

	var topics []Topic

	categories := map[string]string{
		"basics": "Cơ bản",
		"types": "Kiểu dữ liệu",
		"funcs": "Hàm & Closure",
		"structs": "Struct & Interface",
		"concurrency": "Concurrency",
		"generics": "Generics",
		"memory": "Memory & GC",
		"advanced": "Kỹ thuật nâng cao",
		"keywords": "Keywords",
	}

	for _, file := range files {
		contentBytes, err := os.ReadFile(file)
		if err != nil {
			panic(err)
		}
		content := string(contentBytes)

		if file != "index.html" {
			categoryID := strings.TrimSuffix(file, ".html")
			categoryName := categories[categoryID]
			if categoryName == "" {
				categoryName = categoryID
			}

			matches := reTopicCard.FindAllStringSubmatch(content, -1)
			for _, m := range matches {
				if len(m) >= 5 {
					fullHTML := m[1]
					title := m[2]
					desc := m[3]
					detailHTML := m[4]

					fullHTML = reOnclick.ReplaceAllString(fullHTML, "")
					fullHTML = replacePreBlocks(fullHTML)

					textContent := reText.ReplaceAllString(detailHTML, " ")
					textContent = strings.Join(strings.Fields(textContent), " ")

					topics = append(topics, Topic{
						Category:    categoryName,
						URL:         file,
						Title:       title,
						Description: desc,
						Content:     textContent,
						HTML:        fullHTML,
					})
				}
			}
		}

		// Clean up inline events
		content = reOnclick.ReplaceAllString(content, "")
		content = reOninput.ReplaceAllString(content, "")

		// Process <pre> blocks
		content = replacePreBlocks(content)

		// Normalize Prism assets so reruns don't duplicate them.
		content = normalizeAssets(content, []string{prismCSSLine}, "</head>")
		content = normalizeAssets(content, []string{prismJSLine, prismGoJSLine}, "</body>")

		if file == "index.html" {
			if !strings.Contains(content, "fuse.js") {
				content = strings.Replace(content, "</body>", `  <script src="https://cdn.jsdelivr.net/npm/fuse.js/6.6.2"></script>`+"\n"+`  <script src="assets/js/search_data.js"></script>`+"\n</body>", 1)
			}
		}

		err = os.WriteFile(file, []byte(content), 0644)
		if err != nil {
			panic(err)
		}
		fmt.Println("Processed", file)
	}

	jsonData, _ := json.MarshalIndent(topics, "", "  ")
	searchDataJS := "window.SEARCH_DATA = " + string(jsonData) + ";"
	if err := os.MkdirAll(filepath.Dir(searchDataPath), 0755); err != nil {
		panic(err)
	}
	err = os.WriteFile(searchDataPath, []byte(searchDataJS), 0644)
	if err != nil {
		panic(err)
	}
	fmt.Println("Generated", searchDataPath, "with", len(topics), "topics")
}
